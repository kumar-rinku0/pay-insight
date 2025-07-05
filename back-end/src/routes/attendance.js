import express from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendanceInfoWithBranchInfo,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetEmployeesAttendanceWithPunchingInfo,
  handleUpdateAttandance,
} from "../controllers/attendance.js";

import { onlyAdminOrManagerUser } from "../middlewares/auth.js";

// import { handleUploadImage } from "../util/cloud-init.js";
import multer from "multer";
import { handleUploadImage } from "../utils/cloud-init.js";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/mark")
  .post(
    upload.single("punchInPhoto"),
    wrapAsync(handleUploadImage),
    wrapAsync(handlemarkPunchIn)
  );
router
  .route("/mark")
  .put(
    upload.single("punchOutPhoto"),
    wrapAsync(handleUploadImage),
    wrapAsync(handlemarkPunchOut)
  );

router
  .route("/users/information/today")
  .get(wrapAsync(handleGetOneSpecificUserAttendanceInfoWithBranchInfo));

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

router
  .route("/upload")
  .post(upload.single("image"), wrapAsync(handleUploadImage), (req, res) => {
    console.log("url is:", req.url);
    return res.status(200).json({ status: "okay." });
  });

export default router;
