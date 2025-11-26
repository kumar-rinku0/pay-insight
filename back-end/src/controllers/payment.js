import Payment from "../models/payment.js";
import User from "../models/user.js";

export const handleCreatePaymentByGateway = async ({
  initiatedBy,
  paymentFor,
  amount,
  order,
  plan,
  status,
}) => {
  const payment = new Payment({
    initiatedBy,
    paymentFor,
    amount,
    order,
    plan,
    status,
  });
  await payment.save();
  return payment;
};

export const getCustomerIdByUserId = async ({ userId }) => {
  const user = await User.findById(userId);
  return user;
};

export const handleGetPaymentForGateway = async ({ initiatedBy, order }) => {
  const payment = await Payment.findOne({ initiatedBy, order }).sort({
    createdAt: -1,
  });
  return payment;
};

export const handleGetPaymentsInitiatedBy = async (req, res) => {
  const initiatedBy = req.params.initiatedBy;
  const payments = await Payment.find({ initiatedBy: initiatedBy });
  if (!payments) {
    return res.status(404).json({ message: "No payments found", payments: [] });
  }
  return res.status(200).json({ message: "Payment found", payments });
};

import crypto from "crypto";

// ✅ Razorpay webhook MUST use raw body

export const handleWebhook = async (req, res) => {
  const rawBody = req.body.toString(); // 🔹 raw body as text
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

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

// app.post(
//   "/api/razorpay/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     try {

//     } catch (error) {
//       console.error("Webhook error:", error);
//       return res.status(500).send("Internal Server Error");
//     }
//   }
// );

// app.listen(3000, () => console.log("Server running on port 3000"));
