import express from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendanceInfoWithBranchInfo,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetEmployeesAttendanceWithPunchingInfo,
  handleUpdateAttandance,
} from "../controller/attendance.js";

import { onlyAdminOrManagerUser } from "../middleware/auth.js";

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
  .post(wrapAsync(handleGetOneSpecificUserAttendanceInfoWithBranchInfo));

router
  .route("/attendancebyid/:attendanceId")
  .get(wrapAsync(handleGetOneSpecificDateAttendance));

router
  .route("/month/information")
  .post(wrapAsync(handleGetOneSpecificMonthAttendance));

router
  .route("/update")
  .patch(onlyAdminOrManagerUser, wrapAsync(handleUpdateAttandance));

router
  .route("/employees")
  .get(
    onlyAdminOrManagerUser,
    wrapAsync(handleGetEmployeesAttendanceWithPunchingInfo)
  );

export default router;
