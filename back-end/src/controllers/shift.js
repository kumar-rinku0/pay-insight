import Shift from "../models/shift.js";
import { Attendance } from "../models/attendance.js";
import {
  getTodayTimestamp,
  getLocaleDateStringByTimeZone,
  formatDateForComparison,
} from "../utils/functions.js";

export const getAllShifts = async (req, res) => {
  const shifts = await Shift.find({});
  if (shifts.length === 0) {
    return res.status(404).json({ error: "No shifts found!" });
  }
  return res.status(200).json({ shifts: shifts });
};

export const getShiftByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  const shift = await Shift.findOne({ createdFor: employeeId });
  if (!shift) {
    return res
      .status(404)
      .json({ error: `No shift found for employeeId: ${employeeId}` });
  }
  return res.status(200).json({ shift: shift });
};

export const handleCreateShifts = async (req, res) => {
  const {
    type,
    endTime,
    startTime,
    weekOffs,
    employeeId,
    halfDayLateBy,
    lateBy,
  } = req.body;
  const previous = await Shift.findOne({ createdFor: employeeId });
  if (previous) {
    return res
      .status(201)
      .send({ message: "already assigned a shift.", shift: previous });
  }
  const shift = new Shift({
    halfDayLateBy,
    lateBy,
    type,
    endTime,
    startTime,
    weekOffs,
    createdFor: employeeId,
  });
  await shift.save();
  return res.status(201).send({ message: "shift created.", shift: shift });
};

export const handleShiftUpdateById = async (req, res) => {
  const { shiftId } = req.params;
  const { type, endTime, startTime, weekOffs, halfDayLateBy, lateBy } =
    req.body;
  const shift = await Shift.findByIdAndUpdate(
    shiftId,
    { type, endTime, startTime, weekOffs, halfDayLateBy, lateBy },
    { new: true }
  );
  if (!shift) {
    return res.status(404).json({ error: "Shift not found!" });
  }
  return res
    .status(200)
    .json({ message: "Shift updated successfully!", shift });
};

// function

export const shiftWithPunchingDiffrence = async (roleId) => {
  const shift = await Shift.findOne({
    createdFor: roleId,
  });
  if (!shift) {
    return {
      success: false,
      message: "Shift is not assigned to user.",
      shift,
      diffrence: false,
    };
  }

  if (shift.weekOffs.includes(new Date().getDay())) {
    return {
      success: false,
      message: "Today is a week off!",
      shift,
      diffrence: false,
    };
  }

  if (shift.startTime > shift.endTime) {
    const shfitStartTime = getTodayTimestamp(shift.startTime);
    const shiftEndTime = getTodayTimestamp(shift.endTime);
    //  + 24 * 60 * 60 * 1000; // adding 24 hours for next day
    const currentTime = Date.now();
    console.log(
      "shfitStartTime",
      shfitStartTime,
      "shiftEndTime",
      shiftEndTime,
      "currentTime",
      currentTime
    );

    const startTimeDiff = shfitStartTime - currentTime;
    const endTimeDiff = shiftEndTime - currentTime;
    console.log("startTimeDiff", startTimeDiff, "endTimeDiff", endTimeDiff);
    const diffrence = startTimeDiff > endTimeDiff;
    return {
      success: true,
      diffrence,
      message: diffrence ? "Start Time is Large!" : "End Time is Large!",
      shift,
    };
    // if (startTimeDiff > endTimeDiff) {
    //   const previousDate = new Date(getLocaleDateStringByTimeZone());
    //   previousDate.setDate(previousDate.getDate() - 1);
    //   const date = formatDateForComparison(
    //     getLocaleDateStringByTimeZone(previousDate)
    //   );
    //   console.log("previousDate", previousDate, "date", date);
    //   const attendance = await Attendance.findOne({
    //     $and: [{ date: date, role: role._id }],
    //   });
    //   if (!attendance) {
    //     return res.status(200).json({
    //       message: "user isn't punched in yet!",
    //       lastPuchedOut: true,
    //       radius: branch.radius,
    //       coordinates: branch.geometry.coordinates,
    //       shift,
    //     });
    //   }
    //   if (attendance && attendance.punchingInfo.length === 0) {
    //     return res.status(200).json({
    //       message: "info doesnt exist!",
    //       lastPuchedOut: true,
    //       radius: branch.radius,
    //       coordinates: branch.geometry.coordinates,
    //       shift,
    //     });
    //   }
    //   const lastPunchingInfo = attendance.punchingInfo.pop();
    //   let lastPuchedOut = false;
    //   if (lastPunchingInfo.punchOutInfo) {
    //     lastPuchedOut = true;
    //   }
    //   return res.status(200).json({
    //     message: "user already punched in!",
    //     lastPuchedOut: lastPuchedOut,
    //     radius: branch.radius,
    //     coordinates: branch.geometry.coordinates,
    //     shift,
    //   });
    // }
  }
};
