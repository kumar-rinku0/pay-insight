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
