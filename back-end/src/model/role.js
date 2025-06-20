import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required."],
    unique: [true, "User ID must be unique."],
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
    unique: true,
    validate: {
      validator: function (v) {
        return v != null; // Ensure company ID is not null
      },
      message: "Company ID is required.",
    },
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
  name: {
    type: String,
    required: true,
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

const Role = model("Role", roleSchema);
export default Role;
