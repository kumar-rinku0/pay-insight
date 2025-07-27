import { Schema, model } from "mongoose";

const roleSchema = new Schema({
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
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    validate: {
      validator: function (v) {
        return v != null; // Ensure company ID is not null
      },
      message: "Company ID is required.",
    },
  },
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "employee", "hr", "manager"],
      message: "role must be admin, employee, hr or manager.",
    },
    default: "admin",
    required: true,
  },
});

roleSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();

  const Shift = model("Shift");
  const Attendance = model("Attendance");
  const PunchIn = model("PunchIn");
  const PunchOut = model("PunchOut");
  await Shift.findOneAndDelete({
    createdFor: _id,
  });
  const attendanceRecords = await Attendance.find({ role: _id });
  for (const record of attendanceRecords) {
    await PunchIn.deleteMany({
      _id: { $in: record.punchingInfo.map((info) => info.punchInInfo) },
    });
    await PunchOut.deleteMany({
      _id: { $in: record.punchingInfo.map((info) => info.punchOutInfo) },
    });
  }
  console.log(
    "Attendance Punch In/Out deleted, associated shifts and roles removed.",
    attendanceRecords
  );
  await Attendance.deleteMany({ role: _id });
  console.log("Attendance records deleted.");
  return next();
});

roleSchema.pre("deleteMany", async function (next) {
  const docsToDelete = await this.model.find(this.getQuery());
  console.log("Docs to delete:", docsToDelete);
  const Shift = model("Shift");
  const Attendance = model("Attendance");
  const PunchIn = model("PunchIn");
  const PunchOut = model("PunchOut");
  // you can perform operations like logging, archiving, etc. here
  for (const doc of docsToDelete) {
    await Shift.findOneAndDelete({
      createdFor: doc._id,
    });
    const attendanceRecords = await Attendance.find({ role: doc._id });
    for (const record of attendanceRecords) {
      await PunchIn.deleteMany({
        _id: { $in: record.punchingInfo.map((info) => info.punchInInfo) },
      });
      await PunchOut.deleteMany({
        _id: { $in: record.punchingInfo.map((info) => info.punchOutInfo) },
      });
    }
    console.log(
      "Attendance Punch In/Out deleted, associated shifts and roles removed.",
      attendanceRecords
    );
    await Attendance.deleteMany({ role: doc._id });
    console.log("Attendance records deleted.");
  }
  return next();
});

const Role = model("Role", roleSchema);
export default Role;
