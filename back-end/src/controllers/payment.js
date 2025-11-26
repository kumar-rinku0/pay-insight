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

export const handleGetPaymentForGateway = async ({ order }) => {
  const payment = await Payment.findOne({ order });
  return payment;
};

export const handleGetPaymentsInitiatedBy = async (req, res) => {
  const initiatedBy = req.params.initiatedBy;
  const payments = await Payment.find({ initiatedBy: initiatedBy });
  if (!payments) {
    return res.status(404).json({ message: "No payments found", payments: [] });
  }
  return res.status(200).json({ message: "Payments found", payments });
};

// ✅ Razorpay webhook MUST use raw body

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
