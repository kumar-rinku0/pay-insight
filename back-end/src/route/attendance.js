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

const router = express.Router();

router.route("/mark").post(wrapAsync(handlemarkPunchIn));
router.route("/mark").put(wrapAsync(handlemarkPunchOut));
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
