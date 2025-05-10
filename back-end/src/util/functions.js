import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";

if (process.env.NODE_ENV != "development") {
  configDotenv();
}
// const mapToken = process.env.MAPBOX_DEFAULT_TOKEN;

export const isRightUser = async function (email, password) {
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return { message: "wrong email address.", status: 400 };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return { message: "wrong password.", status: 401 };
  }
  if (!user.isVerified) {
    return { message: "please verify your email.", status: 406 };
  }
  // if (user.role !== "admin" && user.status !== "active") {
  //   return { message: "blocked by admin!!", status: 403 };
  // }
  return user;
};

export function generateRandomString(length, includeNumeric = true) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
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

export const currntTimeInFixedFomat = (currDate, delay = 0) => {
  const currentDate = new Date(currDate + delay * 60 * 1000);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const formatDateForComparison = (dateObj) => {
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export function getTodayTimestamp(timeStr, extraMinutes = 0) {
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Get today's date
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const day = now.getDate();

  const dateWithTime = new Date(year, month, day, hours, minutes, 0, 0);

  dateWithTime.setMinutes(dateWithTime.getMinutes() + extraMinutes);

  return Date.parse(new Date(dateWithTime.getTime()));
}

// Function to reverse geocode (coordinates to address)
export const reverseGeocode = async (latitude, longitude) => {
  return null;
};

export const cookieOptions = () => ({
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production", // Set to true in production
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
