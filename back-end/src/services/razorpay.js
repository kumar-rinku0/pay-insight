import { config } from "dotenv";
config();

import crypto from "crypto";
import Razorpay from "razorpay";
import {
  getCustomerIdByUserId,
  handleGetPaymentForGateway,
  handleCreatePaymentByGateway,
} from "../controllers/payment.js";
import { getByPlanId } from "../models/payment.js";

const CLIENT_ID = process.env.RAZORPAY_KEY_ID;
const SECRET_KEY = process.env.RAZORPAY_KEY_SECRET;
const DOMAIN = process.env.DOMAIN;

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
        orderInfo: {
          _id: order.id,
          customer_id: customer_id,
          amount: order.amount,
          redirectUrl: `${DOMAIN}/payment-status`,
        },
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
    payment.status = "failed";
    await payment.save();
    return res
      .status(400)
      .json({ message: "payment failed.", status: "not okay" });
  }
  const order_id = payment.order;
  const generated_signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(order_id + "|" + razorpay_payment_id)
    .digest("hex");
  payment.payment = razorpay_payment_id;
  payment.sign = razorpay_signature;
  if (
    razorpay_order_id === payment.order &&
    generated_signature === razorpay_signature
  ) {
    payment.status = "captured";
    await payment.save();
    return res
      .status(200)
      .json({ message: "payment captured.", status: "okay" });
  } else {
    payment.status = "failed";
    await payment.save();
    return res
      .status(400)
      .json({ message: "payment failed.", status: "not okay" });
  }
};

export const handleGetPaymentStauts = async (req, res) => {
  const user = req.user;
  const { orderId } = req.query;
  const payment = await handleGetPaymentForGateway({
    initiatedBy: user._id,
    order: orderId,
  });
  if (payment.status === "captured") {
    return res.status(200).json({ message: "okay.", state: "COMPLETED" });
  }
  return res.status(200).json({ message: "not okay", state: "FAILED" });
};
