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
      .send({ message: "name, phone and branch count are required." });
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
      .send({ message: "you are not a member of this company!" });
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

const handleUpdateCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const { name, cin, gst, logo, website, type, branches } = req.body;
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(400).send({ message: "company not found!" });
  }
  company.name = name || company.name;
  company.cin = cin || company.cin;
  company.gst = gst || company.gst;
  company.logo = logo || company.logo;
  company.website = website || company.website;
  company.type = type || company.type;
  company.branches = branches || company.branches;
  await company.save();
  const roles = await Role.find({ company: company._id });
  for (const role of roles) {
    if (role.company.toString() !== company._id.toString()) continue;
    role.name = company.name;
    await role.save();
  }
  const role = await Role.findOne({ user: req.user._id, company: company._id });
  req.session.user = { ...req.user, role: role };
  return res
    .status(200)
    .send({ message: "company updated.", company: company, role: role });
};

const handleDeleteCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(400).send({ message: "company not found!" });
  }
  await Company.deleteOne({ _id: companyId });
  await Role.deleteMany({ company: companyId });
  const user = req.user;
  if (user.role.company.toString() !== companyId.toString()) {
    return res.status(200).send({
      message: "company deleted.",
      company: company,
    });
  }
  const role = await Role.findOne({ user: user._id });
  if (role) {
    req.session.user = { ...req.user, role: role };
  } else {
    req.session.user = { ...req.user, role: null };
  }
  return res.status(200).send({
    message: "company deleted.",
    company: company,
    role: role || null,
  });
};
export {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
  handleSelectCompany,
  handleUpdateCompanyById,
  handleDeleteCompanyById,
};
