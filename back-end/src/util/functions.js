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
    return {
      message: "wrong email address.",
      type: "UserNotFound",
      status: 400,
    };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return {
      message: "wrong password.",
      type: "PasswordNotMatch",
      status: 401,
    };
  }
  if (!user.isVerified) {
    return {
      message: "please verify your email.",
      type: "EmailNotVerified",
      status: 403,
    };
  }
  // if (user.role !== "admin" && user.status !== "active") {
  //   return {
  //     message: "blocked by admin!!",
  //     type: "ErrorBlockedUser",
  //     status: 403,
  //   };
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

export const formatDateForComparison = (localeDate) => {
  const date = new Date(localeDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function getTodayTimestamp(timeStr, extraMinutes = 0) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return (
    new Date(`${today} ${hours}:${minutes}:00 GMT+0530`).getTime() +
    extraMinutes * 60 * 1000
  );
}

export function getLocaleDateStringByTimeZone() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
  });
}
export function getLocaleMonthStringByTimeZone() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    month: "long",
  });
}

// Function to reverse geocode (coordinates to address)
export const reverseGeocode = async (latitude, longitude) => {
  return null;
};

export const fixName = (name) => {
  return name.replace(/\s+/g, "");
};
