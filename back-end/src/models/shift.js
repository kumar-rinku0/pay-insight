import { Schema, model } from "mongoose";

const shiftShema = new Schema({
  type: {
    type: String,
    default: "morning",
    enum: {
      values: ["morning", "noon", "evening", "night"],
      message: "invailid shift!",
    },
  },
  weekOffs: {
    type: [String],
    default: ["sat", "sun"],
    required: true,
  },
  lateBy: {
    type: Number,
    default: 0,
  },
  halfDayLateBy: {
    type: Number,
    default: 30,
  },
  startTime: {
    type: String,
    required: [true, "startTime is required."],
  },
  endTime: {
    type: String,
    required: [true, "endTime is required."],
  },
  createdFor: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "createdFor is required."],
    unique: [true, "createdFor must be unique."],
  },
});

const Shift = model("Shift", shiftShema);

export default Shift;
