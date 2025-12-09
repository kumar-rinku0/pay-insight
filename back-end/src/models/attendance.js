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
    // working hours calculation can be added later
    workHours: {
      type: Number,
      default: null,
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
  if (this.punchingInfo) {
    if (this.punchingInfo.length === 0) {
      return next();
    }
    const lastObj = this.punchingInfo.pop();
    console.log("lastObj", lastObj);
    const inTime = new Date(lastObj?.punchInInfo.createdAt).getTime();
    console.log("inTime", inTime);
    const shift = await Shift.findOne({ createdFor: this.role });
    if (!shift) {
      return next(new Error("doesn't assigned any shift!"));
    }
    if (lastObj?.punchOutInfo) {
      const outTime = new Date(lastObj?.punchOutInfo.createdAt).getTime();
      const diffMs = outTime - inTime; // difference in milliseconds
      console.log("diffMs", diffMs, "inTime", inTime, "outTime", outTime);
      const diffHours = diffMs / (1000 * 60 * 60); // convert ms → hours
      this.workHours = parseFloat(diffHours.toFixed(2));
      this.punchingInfo.push(lastObj);
      return next();
    }
    const shiftStartTime = getTodayTimestamp(shift.startTime, shift.lateBy);
    const shiftStartTimeWithDelay = getTodayTimestamp(
      shift.startTime,
      shift.halfDayLateBy
    );
    console.log(shiftStartTime, shiftStartTimeWithDelay);
    if (shiftStartTime >= inTime) {
      this.status = "on time";
    } else if (shiftStartTime < inTime && shiftStartTimeWithDelay >= inTime) {
      this.status = "late";
    } else if (shiftStartTimeWithDelay < inTime) {
      this.status = "half day";
    }
    this.punchingInfo.push(lastObj);
  }
  return next();
});

const Attendance = model("Attendance", attendanceSchema);

export { PunchIn, PunchOut, Attendance };
