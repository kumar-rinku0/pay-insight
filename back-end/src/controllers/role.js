import Role from "../models/role.js";

export const handleGetOneUserRoles = async (req, res) => {
  const { userId } = req.params;
  const roles = await Role.find({ user: userId }).populate("company");
  if (!roles) {
    return res.status(400).json({ error: "invailid user id." });
  }
  return res.status(200).json({ roles: roles, message: "user roles!" });
};

export const handleGetEmployeeRoles = async (req, res) => {
  const { company } = req.user.role;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const query = {
    $and: [
      { company: company },
      { role: { $in: ["employee", "manager", "admin"] } },
      { branch: { $exists: true, $ne: null } },
    ],
  };
  const totalRoles = await Role.countDocuments(query);
  const roles = await Role.find(query)
    .limit(limit)
    .skip(skip)
    .populate("user", "name email");

  return res.status(200).send({
    message: "employee & manager in company!",
    roles: roles,
    totalPage: Math.ceil(totalRoles / limit),
  });
};

// middlewares.
export const onlyLimitedRolesAccess = async (req, res, next) => {
  const subscription = req.subscription;
  const { company } = req.user.role;
  const query = {
    $and: [
      { company: company },
      { role: { $in: ["employee", "manager", "admin"] } },
      { branch: { $exists: true, $ne: null } },
    ],
  };
  const totalRoles = await Role.countDocuments(query);
  if (totalRoles <= 2) {
    return next();
  } else if (subscription.pro) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "upgrade subscription to pro.", code: "ErrorPro" });
};
