import Company from "../models/company.js";
import Role from "../models/role.js";
import User from "../models/user.js";

const handleFetchCompanies = async (req, res) => {
  const { userId } = req.params;
  const companies = await Company.find({ createdBy: userId });
  return res.status(200).send({ message: "ok!", companies: companies });
};

const handleCreateCompany = async (req, res) => {
  const { name, cin, gst, logo, website, type, branches, phone } = req.body;
  if (!name || !phone || !branches) {
    return res
      .status(400)
      .send({ error: "name, phone and branch count are required." });
  }
  const user = await User.findById(req.user._id);
  const company = new Company({
    name,
    cin,
    gst,
    logo,
    website,
    type,
    branches,
    createdBy: user._id,
  });
  const role = new Role({
    user: user._id,
    company: company._id,
    name: company.name,
    branch: null,
    role: "admin",
  });
  user.phone = phone;
  user.roles.push(role);
  await company.save();
  await role.save();
  await user.save();
  req.session.user = { ...req.user, role: role };
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
  req.session.user = { ...req.user, role: role };
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
