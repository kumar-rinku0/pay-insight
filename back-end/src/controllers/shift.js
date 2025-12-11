import Shift from "../models/shift.js";
import { currntTimeInFixedFomat } from "../utils/functions.js";

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

export const shiftAndPunchingTodayOrPreviousDay = async (roleId) => {
  const shift = await Shift.findOne({
    createdFor: roleId,
  });
  if (!shift) {
    return {
      success: false,
      message: "Shift is not assigned to user.",
      shift,
      isToday: true,
    };
  }

  if (shift.weekOffs.includes(new Date().getDay())) {
    return {
      success: false,
      message: "Today is a week off!",
      shift,
      isToday: true,
    };
  }

  if (shift.startTime > shift.endTime) {
    const currTime = currntTimeInFixedFomat(Date.now());
    const currTimeValue = Number(currTime.replace(":", "."));
    const startTimeValue = Number(shift.startTime.replace(":", "."));
    const endTimeValue = Number(shift.endTime.replace(":", "."));

    const startTimeDif = Math.abs(currTimeValue - startTimeValue);
    const endTimeDiff = Math.abs(currTimeValue - endTimeValue);
    const isToday = startTimeDif < endTimeDiff;
    console.log("isToday", isToday);
    return {
      success: true,
      isToday: isToday,
      message: isToday ? "Yes Today!" : "Pervious Day!",
      shift,
    };
  }

  return {
    success: true,
    message: "Start Time Smaller Then End Time!",
    shift,
    isToday: true,
  };
};
