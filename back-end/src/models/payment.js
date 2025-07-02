import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
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

const Payment = model("Payment", paymentSchema);
export default Payment;
