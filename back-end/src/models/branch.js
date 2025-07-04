import { Schema, model } from "mongoose";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required."],
    },
    address: {
      type: String,
      required: [true, "Branch address is required."],
    },
    radius: {
      type: Number,
      required: [true, "Branch radius is required."],
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Associated company is required."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required."],
    },
  },
  { timestamps: true }
);

branchSchema.index({ branchGeometry: "2dsphere" });

const Branch = model("Branch", branchSchema);

export default Branch;
