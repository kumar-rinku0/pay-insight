import { Schema, model } from "mongoose";
import Shift from "../models/shift.js";
import { getTodayTimestamp } from "../utils/functions.js";

// branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

const punchInSchema = new Schema(
  {
    status: {
      type: String,
      default: "punch in",
    },
    punchInGeometry: {
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
    punchInImg: String,
    punchInAddress: String,
  },
  { timestamps: true }
);
punchInSchema.index({ punchInGeometry: "2dsphere" });
const PunchIn = model("PunchIn", punchInSchema);

const punchOutSchema = new Schema(
  {
    status: {
      type: String,
      default: "punch out",
    },
    punchOutGeometry: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    punchOutImg: String,
    punchOutAddress: String,
  },
  { timestamps: true }
);
punchOutSchema.index({ punchOutGeometry: "2dsphere" });
const PunchOut = model("PunchOut", punchOutSchema);

const attendanceSchema = new Schema(
  {
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // company: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Company",
    //   required: true,
    // },
    // branch: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Branch",
    //   required: true,
    // },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["on time", "late", "half day", "holiday", "absent"],
        message: "invailid status!",
      },
      default: "absent",
    },
    punchingInfo: {
      type: [
        {
          punchInInfo: {
            type: Schema.Types.ObjectId,
            ref: "PunchIn",
          },
          punchOutInfo: {
            type: Schema.Types.ObjectId,
            ref: "PunchOut",
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

attendanceSchema.pre("save", async function (next) {
  // if (this.isModified("punchingInfo")) {
  if (this.punchingInfo) {
    if (this.punchingInfo.length === 0) {
      return next();
    }
    const lastObj = this.punchingInfo.pop();
    if (lastObj?.punchOutInfo) {
      this.punchingInfo.push(lastObj);
      return next();
    }
    const currTime = new Date(lastObj?.punchInInfo.createdAt).getTime();
    console.log("currTime", currTime);
    const shift = await Shift.findOne({ createdFor: this.role });
    if (!shift) {
      return next(new Error("doesn't assigned any shift!"));
    }
    const shiftStartTime = getTodayTimestamp(shift.startTime, shift.lateBy);
    const shiftStartTimeWithDelay = getTodayTimestamp(
      shift.startTime,
      shift.halfDayLateBy
    );
    console.log(shiftStartTime, shiftStartTimeWithDelay);
    if (shiftStartTime >= currTime) {
      this.status = "on time";
    } else if (
      shiftStartTime < currTime &&
      shiftStartTimeWithDelay >= currTime
    ) {
      this.status = "late";
    } else if (shiftStartTimeWithDelay < currTime) {
      this.status = "half day";
    }
    this.punchingInfo.push(lastObj);
  }
  // }
  return next();
});

const Attendance = model("Attendance", attendanceSchema);

export { PunchIn, PunchOut, Attendance };
