import { config } from "dotenv";
config();

import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../model/payment.js";

const CLIENT_ID = process.env.RAZORPAY_CLIENT_ID;
const SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;
const DOMAIN = process.env.DOMAIN;
console.log(CLIENT_ID, SECRET_KEY);

export const client = new Razorpay({
  key_id: CLIENT_ID,
  key_secret: SECRET_KEY,
});

export const handleCreatePaymentRequest = (req, res) => {
  const { amount } = req.body;
  const user = req.user;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({
      message: "Invalid or missing amount.",
      type: "BadRequest",
    });
  }
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `RCPT#${Date.now()}`,
  };

  client.orders.create(options, async function (err, order) {
    if (order) {
      const payment = new Payment({
        user: user._id,
        amount: amount,
        order: order.id,
        status: "created",
      });
      await payment.save();
      return res.status(201).json({
        message: "okay",
        orderInfo: {
          _id: order.id,
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
  const payment = await Payment.findOne({ user: user._id }).sort({
    createdAt: -1,
  });
  const order_id = payment.order;
  const generated_signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    payment.status = "captured";
    await payment.save();
    return res
      .status(200)
      .json({ message: "payment captured.", status: "okay" });
  } else {
    payment.status = "failed";
    await payment.save();
    return res
      .status(200)
      .json({ message: "payment failed.", status: "not okay" });
  }
};

export const handleGetPaymentStauts = async (req, res) => {
  const user = req.user;
  const { orderId } = req.query;
  const payment = await Payment.findOne({
    user: user._id,
    order: orderId,
  }).sort({
    createdAt: -1,
  });
  if (payment.status === "captured") {
    return res.status(200).json({ message: "okay.", state: "COMPLETED" });
  }
  return res.status(200).json({ message: "not okay", state: "FAILED" });
};
