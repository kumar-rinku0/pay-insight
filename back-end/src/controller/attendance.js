import { PunchIn, PunchOut, Attendance } from "../model/attendance.js";
import Branch from "../model/branch.js";
import Role from "../model/role.js";
import { formatDateForComparison } from "../util/functions.js";
import { reverseGeocode } from "../util/functions.js";

const handlemarkPunchIn = async (req, res) => {
  const { userId, companyId, branchId, punchInGeometry } = req.body;
  if (!req.url) {
    return res.json({ message: "file not found." });
  }
  const punchInPhoto = req.url;
  const date = formatDateForComparison(new Date());
  const month = new Date().toLocaleString("en-IN", {
    month: "long",
  });
  const punchInAddress = await reverseGeocode(
    punchInGeometry.coordinates[1],
    punchInGeometry.coordinates[0]
  );
  const punchIn = new PunchIn({
    punchInGeometry,
    punchInAddress,
    punchInPhoto,
  });
  await punchIn.save();
  const prevAttendance = await Attendance.findOne({
    $and: [{ date: date, company: companyId, user: userId, branch: branchId }],
  });
  if (prevAttendance) {
    prevAttendance.punchingInfo.push({ punchInInfo: punchIn });
    await prevAttendance.save();

    return res.status(201).json({ message: "punched in!", punchIn: punchIn });
  }
  const attendance = new Attendance({
    user: userId,
    company: companyId,
    branch: branchId,
    date,
    month,
  });
  attendance.punchingInfo.push({ punchInInfo: punchIn });
  await attendance.save();

  return res.status(201).json({ message: "punched in!", punchIn: punchIn });
};

const handlemarkPunchOut = async (req, res) => {
  const { userId, companyId, branchId, punchOutGeometry } = req.body;
  if (!req.url) {
    return res.json({ message: "file not found." });
  }
  const punchOutPhoto = req.url;
  const punchOutAddress = await reverseGeocode(
    punchOutGeometry.coordinates[1],
    punchOutGeometry.coordinates[0]
  );
  const punchOut = new PunchOut({
    punchOutGeometry,
    punchOutAddress,
    punchOutPhoto,
  });
  await punchOut.save();
  const date = formatDateForComparison(new Date());

  const attendance = await Attendance.findOne({
    $and: [{ date: date, company: companyId, user: userId, branch: branchId }],
  });
  const lastPunchInInfo = attendance.punchingInfo.pop();
  lastPunchInInfo.punchOutInfo = punchOut;
  attendance.punchingInfo.push(lastPunchInInfo);
  await attendance.save();

  res.status(201).json({
    message: "punched out!",
    punchOut: punchOut,
    attendance: attendance,
  });
};

// Get All Attendance Records
const handleGetOneSpecificUserAttendanceInfoWithBranchInfo = async (
  req,
  res
) => {
  const { userId, companyId, branchId } = req.body;
  const date = formatDateForComparison(new Date().toLocaleString());

  const attendance = await Attendance.findOne({
    $and: [{ date: date, company: companyId, user: userId, branch: branchId }],
  });
  const branch = await Branch.findById(branchId);
  if (!attendance) {
    return res.status(200).json({
      message: "user isn't punched in yet!",
      lastPuchedOut: true,
      branch: branch,
      radius: branch.radius,
      coordinates: branch.geometry.coordinates,
    });
  }
  if (attendance && attendance.punchingInfo.length === 0) {
    return res.status(200).json({
      message: "info doesnt exist!",
      lastPuchedOut: true,
      branch: branch,
      radius: branch.radius,
      coordinates: branch.geometry.coordinates,
    });
  }
  const lastPunchingInfo = attendance.punchingInfo.pop();
  let lastPuchedOut = false;
  if (lastPunchingInfo.punchOutInfo) {
    lastPuchedOut = true;
  }
  return res.status(200).json({
    message: "user already punched in!",
    lastPunchingInfo: lastPunchingInfo,
    lastPuchedOut: lastPuchedOut,
    attendance: attendance,
    branch: branch,
    radius: branch.radius,
    coordinates: branch.geometry.coordinates,
  });
};

const handleGetOneSpecificMonthAttendance = async (req, res) => {
  const { roleId, month } = req.body;
  const role = await Role.findById(roleId).populate("user", "name email");
  const query = {
    $and: [
      {
        month: month,
      },
      {
        user: role.user._id,
      },
      {
        company: role.company,
      },
      {
        branch: role.branch,
      },
    ],
  };
  const attendances = await Attendance.find(query).populate(
    "punchingInfo.punchInInfo"
  );
  return res.status(200).json({
    message: "ok",
    user: role.user,
    attendances: attendances,
  });
};

const handleGetOneSpecificDateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const attendance = await Attendance.findById(attendanceId)
    .populate("punchingInfo.punchInInfo")
    .populate("punchingInfo.punchOutInfo");
  if (!attendance) {
    return res.status(404).json({
      message: "Attendance not found!",
    });
  }
  return res.status(200).json({
    message: "ok",
    attendance: attendance,
  });
};

// Fetch attendance statistics for the dashboard
const handleGetEmployeesAttendanceWithPunchingInfo = async (req, res) => {
  const user = req.user;
  const formattedDate = formatDateForComparison(new Date().toLocaleString());
  const query = {
    $and: [{ date: formattedDate }, { company: user.role.company }],
  };
  const attendances = await Attendance.find(query)
    .populate("user", "name email")
    .populate("punchingInfo.punchInInfo", "status createdAt")
    .populate("punchingInfo.punchOutInfo", "status createdAt");

  return res.status(200).json({
    message: "ok",
    attendances: attendances,
    puchInCount: attendances.length,
  });
};

export {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendanceInfoWithBranchInfo,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetEmployeesAttendanceWithPunchingInfo,
};
