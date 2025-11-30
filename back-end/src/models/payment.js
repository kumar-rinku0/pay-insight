import { Schema, model } from "mongoose";

export const plans = [
  {
    _id: "001",
    duration: "1 Month",
    durationDays: 30,
    price: 49,
  },
  {
    _id: "002",
    duration: "3 Months",
    durationDays: 90,
    price: 129,
  },
  {
    _id: "003",
    duration: "6 Months",
    durationDays: 180,
    price: 249,
  },
  {
    _id: "004",
    duration: "1 Year",
    durationDays: 365,
    price: 449,
  },
];

const paymentSchema = new Schema(
  {
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      validate: {
        validator: function (v) {
          return v != null; // Ensure user ID is not null
        },
        message: "User ID is required.",
      },
    },
    paymentFor: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required."],
      validate: {
        validator: function (v) {
          return v != null; // Ensure user ID is not null
        },
        message: "Company ID is required.",
      },
    },
    plan: {
      type: String,
      required: [true, "plan is required."],
    },
    order: {
      type: String,
      required: true,
      trim: true,
    },
    payment: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    sign: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["created", "authorized", "captured", "failed", "refunded"],
        message: "invailid payment status assignment!",
      },
    },
  },
  { timestamps: true }
);

paymentSchema.post("save", async function (payment, next) {
  if (payment.status === "captured") {
    const Subscription = model("Subscription");
    const paymentFor = payment.paymentFor;
    const subscription = await Subscription.findOne({
      company: paymentFor,
    }).exec();
    if (!subscription) {
      return next(new Error("user subscription doesn't exist.")); // this case never exist until user subscription deleted manually.
    }
    if (subscription.pro) {
      subscription.upcoming.push(payment.plan);
      await subscription.save();
      return next();
    }
    subscription.pro = true;
    subscription.type = "pro";
    subscription.proExpire =
      Date.now() + getByPlanId(payment.plan).durationDays * 24 * 3600 * 1000;
    await subscription.save();
    // const subscription = await Subscription.findOneAndUpdate(
    //   { createdBy: initiatedBy },
    //   {
    //     pro: true,
    //     type: "pro",
    //     proExpire:
    //       Date.now() +
    //       getByPlanId(payment.plan).durationDays * 24 * 3600 * 1000,
    //   },
    //   { new: true }
    // );
    console.log(subscription);
  }
  return next();
});

const Payment = model("Payment", paymentSchema);
export default Payment;

export const getByPlanId = (planId) => {
  return plans.find((item) => item._id === planId);
};
