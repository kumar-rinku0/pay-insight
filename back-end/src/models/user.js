import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

function generateUsername() {
  const timestamp = Date.now(); // Get current timestamp
  return `user_${timestamp}`;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: generateUsername,
    },
    name: {
      type: String,
      required: [true, "name is required."],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    picture: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [Schema.Types.ObjectId],
      ref: "Role",
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "blocked"],
        message: "status must be active or blocked.",
      },
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: [true, "email already exist."],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    resetToken: String,
    verifyTokenExpire: Date,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving the user document
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hexcode = await bcrypt.hash(this.password.trim(), salt);
    this.password = hexcode;
  }
  next();
});

// delete shift and role when user is deleted
userSchema.pre("findOneAndDelete", async function (next) {
  // Assuming you have a Shift model and a Role model
  const { _id } = this.getQuery();

  const Shift = model("Shift");
  const Role = model("Role");
  const Attendance = model("Attendance");
  const PunchIn = model("PunchIn");
  const PunchOut = model("PunchOut");

  await Shift.deleteOne({
    createdFor: _id,
  });
  await Role.deleteOne({ user: _id });
  const attendanceRecords = await Attendance.find({ user: _id });
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
  await Attendance.deleteMany({ user: _id });
  console.log("Attendance records deleted.");
  next();
});

const User = model("User", userSchema);

export default User;
