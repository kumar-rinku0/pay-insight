import Branch from "../models/branch.js";
import Company from "../models/company.js";
import User from "../models/user.js";

const handleFetchBranches = async (req, res) => {
  const companyId = req.user.role.company;
  const branches = await Branch.find({ company: companyId });
  return res.status(200).json({ message: "ok!", branches: branches });
};

const handleCreateBranch = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(obj._id);
  if (!user) {
    return res.status(400).send({ message: "user not found!" });
  }
  const comp = await Company.findById(obj.company);
  if (!comp) {
    return res.status(400).send({ message: "company not found!" });
  }
  const branch = new Branch({
    name: obj.name,
    radius: obj.radius,
    address: obj.address,
  });
  if (obj.isCoordinates) {
    branch.geometry = obj.geometry;
  } else {
    obj.geometry = {
      type: "Point",
      coordinates: [0, 0],
    };
  }
  branch.geometry = obj.geometry;
  branch.createdBy = user;
  branch.company = comp;
  await branch.save();
  return res.status(200).send({ message: "branch created.", branch: branch });
};

export const handleGetBranchInfo = async (req, res) => {
  const { branch: branchId } = req.user.role;
  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ message: "don't have any branch!" });
  }
  return res.status(200).json({
    message: "goood.",
    branch: branch,
    radius: branch.radius,
    coordinates: branch.geometry.coordinates,
  });
};

export const handleGetBranchInfoByBranchId = async (req, res) => {
  const { branchId } = req.params;
  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ message: "don't have any branch!" });
  }
  return res.status(200).json({
    message: "goood.",
    branch: branch,
  });
};

// middleware.

export const onlyOneBranchAccess = async (req, res, next) => {
  const user = req.user;
  const subscription = req.subscription;
  const branchesCount = await Branch.countDocuments({
    company: user.role.company,
  });
  if (!branchesCount) {
    return next();
  } else if (subscription.pro) {
    return next();
  }
  return res.status(403).json({
    message:
      "free subscribers can only create one branch, upgrade to pro subscription.",
    code: "ErrorPro",
  });
};

export { handleCreateBranch, handleFetchBranches };
