import Company from "../model/company.js";
import Role from "../model/role.js";
import User from "../model/user.js";
import { cookieOptions } from "../util/functions.js";
import { setUser } from "../util/jwt.js";

const handleFetchCompanies = async (req, res) => {
  const { userId } = req.params;
  const companies = await Company.find({ createdBy: userId });
  if (companies.length < 0) {
    return res.status(400).send({ error: "NO COMPANIES FOUND!" });
  }
  return res.status(200).send({ message: "ok!", companies: companies });
};

const handleCreateCompany = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(req.user._id);
  const company = new Company(obj);
  const role = new Role({
    user: user._id,
    company: company._id,
    name: company.name,
    branch: null,
    role: "admin",
  });
  user.roles.push(role);
  await company.save();
  await role.save();
  await user.save();
  const token = setUser(user, role);
  res.cookie("JWT_TOKEN", token, cookieOptions());
  return res.status(200).send({
    message: "company created.",
    company: company,
    role: role,
  });
};

const handleSelectCompany = async (req, res) => {
  const user = req.user;
  const { roleid } = req.params;
  const role = await Role.findById(roleid);
  if (!role) {
    return res
      .status(400)
      .send({ error: "you are not a member of this company!" });
  }
  const token = setUser(user, role);
  res.cookie("JWT_TOKEN", token, cookieOptions());

  return res.status(200).send({
    message: "ok!",
    user: user,
    role: role,
  });
};

const handleGetCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const comp = await Company.findById(companyId);
  return res.status(200).send({ message: "your company.", company: comp });
};

export {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
  handleSelectCompany,
};
