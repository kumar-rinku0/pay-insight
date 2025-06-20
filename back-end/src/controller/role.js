import Role from "../model/role.js";

export const handleGetOneUserRoles = async (req, res) => {
  const { userId } = req.params;
  const roles = await Role.find({ user: userId }).populate("company");
  if (!roles) {
    return res.status(400).json({ error: "invailid user id." });
  }
  return res.status(200).json({ roles: roles, message: "user roles!" });
};

export const handleGetEmployeeRoles = async (req, res) => {
  const { companyId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  console.log(companyId, page, limit, skip);
  const query = {
    $and: [{ company: companyId }, { role: { $in: ["employee", "manager"] } }],
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
