import { config } from "dotenv";
config();

import crypto from "crypto";
import Razorpay from "razorpay";
import {
  getCustomerIdByUserId,
  handleGetPaymentForGateway,
  handleCreatePaymentByGateway,
} from "../controllers/payment.js";
import Payment, { getByPlanId } from "../models/payment.js";

const CLIENT_ID = process.env.RAZORPAY_KEY_ID;
const SECRET_KEY = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
// const DOMAIN = process.env.DOMAIN;

export const client = new Razorpay({
  key_id: CLIENT_ID,
  key_secret: SECRET_KEY,
});

const handleCreatePaymentGatewayCustomer = async (id) => {
  const user = await getCustomerIdByUserId({ userId: id });
  console.log(user);
  if (user?.customerId) {
    return user.customerId;
  } else {
    const { name, email, phone } = user;
    console.log("user sub -", name, email, phone);
    const customer = client.customers
      .create({
        name: name,
        contact: phone,
        email: email,
        fail_existing: "1",
      })
      .then(async (res) => {
        user.customerId = res.id;
        await user.save();
        return res.id;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return customer;
  }
};

export const handleCreatePaymentRequest = async (req, res) => {
  const { _id } = req.body;
  const plan = getByPlanId(_id);
  const user = req.user;
  if (user.role.role === "employee") {
    return res.status(400).json({
      message: "invalid payment request.",
      type: "BadRequest",
    });
  }
  if (!plan || !plan.price || isNaN(plan.price)) {
    return res.status(400).json({
      message: "Invalid or missing amount.",
      type: "BadRequest",
    });
  }
  const customer_id = await handleCreatePaymentGatewayCustomer(user._id);
  const options = {
    amount: plan.price * 100,
    currency: "INR",
    receipt: `RCPT#${Date.now()}`,
    customer_id: customer_id,
  };

  client.orders.create(options, async function (err, order) {
    if (order) {
      await handleCreatePaymentByGateway({
        initiatedBy: user._id,
        paymentFor: user.role.company,
        amount: plan.price,
        order: order.id,
        plan: plan._id,
        status: "created",
      });
      return res.status(201).json({
        message: "okay",
        orderInfo: order,
      });
    } else {
      return res
        .status(500)
        .json({ message: err.error.description, code: err.error.code });
    }
  });
};

export const handleConfirmationPaymentRequest = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const user = req.user;
  const payment = await handleGetPaymentForGateway({
    initiatedBy: user._id,
    order: razorpay_order_id,
  });
  if (!payment) {
    return res
      .status(400)
      .json({ message: "payment not found.", status: "not okay" });
  }
  const order_id = payment.order;
  const generated_signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(order_id + "|" + razorpay_payment_id)
    .digest("hex");
  if (
    razorpay_order_id === payment.order &&
    generated_signature === razorpay_signature
  ) {
    payment.sign = razorpay_signature;
    await payment.save();
    return res
      .status(200)
      .json({ message: "payment verified.", status: "okay" });
  } else {
    return res
      .status(400)
      .json({ message: "payment verification failed.", status: "not okay" });
  }
};

export const handleGetPaymentStauts = async (req, res) => {
  const user = req.user;
  const { orderId } = req.query;
  const payment = await handleGetPaymentForGateway({
    initiatedBy: user._id,
    order: orderId,
  });
  client.orders
    .fetch(orderId)
    .then((order) => {
      if (payment.status === "captured" && order.status === "paid") {
        return res
          .status(200)
          .json({ message: "okay.", state: "COMPLETED", orderInfo: order });
      }
      return res
        .status(200)
        .json({ message: "okay.", state: "PENDING", orderInfo: order });
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({
        message: "order not found.",
        state: "ORDER_NOT_FOUND",
      });
    });
};

export const handleRazorpayWebhook = async (req, res) => {
  const rawBody = req.body.toString(); // 🔹 raw body as text
  const signature = req.headers["x-razorpay-signature"];
  const secret = WEBHOOK_SECRET;

  // ✅ Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid Razorpay signature");
    return res.status(400).send("Invalid signature");
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  console.log("✅ Verified webhook event:", event);

  // -------------------------
  // 🔥 Handle events
  // -------------------------

  if (event === "payment.captured") {
    const payment = payload.payload.payment.entity;

    console.log("💰 Payment captured:", payment.id);

    await Payment.updateOne({
      where: { order_id: payment.order_id },
      data: { status: "captured", payment: payment.id },
    });
  }

  if (event === "payment.failed") {
    const payment = payload.payload.payment.entity;

    console.log("❌ Payment failed:", payment.id);

    await Payment.updateOne({
      where: { order_id: payment.order_id },
      data: { status: "failed", payment: payment.id },
    });
  }

  // Razorpay requires quick 2xx response
  return res.status(200).send("OK");
};
