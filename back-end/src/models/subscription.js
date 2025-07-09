import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    trim: true,
  },
  customer: {
    type: String,
    trim: true,
    default: null,
  },
  pro: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ["free", "pro"],
      message: "invalid type assignment.",
    },
    default: "free",
  },
  proExpire: {
    type: Date,
    default: null,
  },
  upcoming: {
    type: [String], // array of upcoming plan _id
    default: [],
  },
});

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;
