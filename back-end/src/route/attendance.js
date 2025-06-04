import express from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendance,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetAttendanceCount,
} from "../controller/attendance.js";

// import { handleUploadImage } from "../util/cloud-init.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/mark").post(
  upload.single("punchInPhoto"),
  // wrapAsync(handleUploadImage),
  wrapAsync(handlemarkPunchIn)
);
router.route("/mark").put(
  upload.single("punchOutPhoto"),
  // wrapAsync(handleUploadImage),
  wrapAsync(handlemarkPunchOut)
);

router
  .route("/users/information/today")
  .post(wrapAsync(handleGetOneSpecificUserAttendance));

router
  .route("/attendancebyid/:attendanceId")
  .get(wrapAsync(handleGetOneSpecificDateAttendance));

router
  .route("/month/information")
  .post(wrapAsync(handleGetOneSpecificMonthAttendance));

router.route("/count/:companyId").get(wrapAsync(handleGetAttendanceCount));

export default router;
