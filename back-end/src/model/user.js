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

// userSchema.pre("save", async function (next) {
//   if (this.roleInfo && Array.isArray(this.roleInfo)) {
//     const values = new Set();
//     for (const roleObj of this.roleInfo) {
//       // If company is missing, handle it based on your requirement.
//       if (!roleObj.company) {
//         return next(
//           new Error("company is required to assign a role to a user.")
//         );
//       }
//       // If company is already in the Set, throw an error for uniqueness
//       if (values.has(roleObj.company.toString())) {
//         return next(
//           new Error("company must be unique along with employee role.")
//         );
//       }
//       // Add the company to the Set to track uniqueness
//       values.add(roleObj.company.toString());
//     }
//   }
//   // Proceed to the next middleware if no error was thrown
//   return next();
// });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hexcode = await bcrypt.hash(this.password.trim(), salt);
    this.password = hexcode;
  }
  next();
});

// userSchema.statics.isRightUser = async function (email, password) {
//   const user = await User.findOne({ email }).exec();
//   if (!user) {
//     return { message: "wrong email." };
//   }
//   const isOk = await bcrypt.compare(password, user.password);
//   if (!isOk) {
//     return { message: "wrong password." };
//   }
//   if (user.role !== "admin" && user.status !== "active") {
//     return { message: "blocked by admin!!" };
//   }
//   return user;
// };

const User = model("User", userSchema);

export default User;
