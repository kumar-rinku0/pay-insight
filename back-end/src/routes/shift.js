import express from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  getAllShifts,
  getShiftByEmployeeId,
  handleCreateShifts,
  handleShiftUpdateById,
} from "../controllers/shift.js";
import { onlyAdminOrManagerUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", wrapAsync(getAllShifts));
router.get("/employeeId/:employeeId", wrapAsync(getShiftByEmployeeId));
router
  .route("/create")
  .post(onlyAdminOrManagerUser, wrapAsync(handleCreateShifts));

router
  .route("/update/shiftId/:shiftId")
  .put(onlyAdminOrManagerUser, wrapAsync(handleShiftUpdateById));

export default router;
