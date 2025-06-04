import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
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
