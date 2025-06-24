import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required."],
      unique: [true, "Company name must be unique."],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Company code is required."],
      unique: [true, "Company code must be unique."],
      default: () => generateRandomString(5),
    },
    cin: {
      type: String,
      required: [true, "CIN is required."],
      unique: [true, "CIN must be unique."],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
        },
        message: (props) => `${props.value} is not a valid CIN!`,
      },
    },
    gst: String,
    logo: String,
    website: String,
    type: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    branches: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required."],
    },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);

export default Company;

function generateRandomString(length, includeNumeric = true) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeric = "0123456789";

  let characters = alphabet;
  if (includeNumeric) {
    characters += numeric;
  }

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}
