import Role from "../model/role.js";

export const handleGetOneUserRoles = async (req, res) => {
  const { userId } = req.params;
  const roles = await Role.find({ user: userId }).populate("company");
  if (!roles) {
    return res.status(400).json({ error: "invailid user id." });
  }
  return res.status(200).json({ roles: roles, message: "user roles!" });
};
