import Company from "../model/company.js";
import User from "../model/user.js";
import { setUser } from "../util/jwt.js";
import bcrypt from "bcryptjs";
import { createMailSystem, createMailSystemForEmployee } from "../util/mail.js";
import {
  generateRandomString,
  isRightUser,
  cookieOptions,
} from "../util/functions.js";
import { getToken } from "../util/auth.js";
import { getInfo } from "../util/jwt.js";

// login, logout & create user
const handleUserSignUp = async (req, res) => {
  const { givenName, familyName, email, password } = req.body;
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    return res
      .status(400)
      .send({ error: "user already exist.", user: userbyemail });
  }
  const user = new User({
    givenName,
    familyName,
    email,
    password,
  });
  await user.save();
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).send({ message: "user created.", user: user });
};

const handleUserSignUpWithRoles = async (req, res) => {
  const { familyName, givenName, email, role, branchId } = req.body;
  const { _id, role: companyRole } = req.user.company;
  if (companyRole === "manager" && role === "admin") {
    return res
      .status(401)
      .send({ error: "you are not allowed to create admin!" });
  }
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    const info = userbyemail.roleInfo.find((item) => {
      return item.company === _id && item.branch === branchId;
    });
    if (!info) {
      userbyemail.roleInfo.push({
        role,
        company: _id,
        branch: branchId,
      });
    } else {
      const obj = info[0];
      obj.role = role;
      userbyemail.roleInfo.push(obj);
    }
    await userbyemail.save();
    return res
      .status(200)
      .send({ message: "user role updated!", user: userbyemail });
  }
  const password = generateRandomString(8, true);
  const user = new User({
    givenName,
    familyName,
    email,
    password,
  });
  console.log(password);
  user.roleInfo.push({ role, company: _id, branch: branchId });
  await user.save();
  await createMailSystemForEmployee({
    address: user.email,
    _id: user._id,
    password,
  });
  return res.status(200).json({ message: "ok", user: user });
};

const handleUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await isRightUser(email, password);
  if (user?.message) {
    return res.status(401).json({ error: user.message, status: user.status });
  }

  if (user.roleInfo.length !== 0) {
    const company = await Company.findById(user.roleInfo[0].company);
    if (company) {
      const roleInfo = user.roleInfo[0];
      user.company = {
        _id: company._id,
        name: company.name,
        role: roleInfo.role,
        branch: roleInfo.branch,
      };
    }
  }
  res.cookie("JWT_TOKEN", "", {
    expires: new Date(0), // Sets the expiration date to a past date to delete the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
    path: "/",
  });
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, cookieOptions());

  return res.status(200).json({
    user: user,
    company: user.company,
    message: "login successful. if user have company it will be in user!",
  });
};

const handleUserLogout = async (req, res) => {
  res.cookie("JWT_TOKEN", "", cookieOptions());
  return res.status(200).json({ message: "logout successful" });
};

// verify user
const handleUserVerify = async (req, res) => {
  const { TOKEN } = req.query;
  console.log(TOKEN);
  const user = await User.findOne({ verifyToken: TOKEN });
  if (user && user.verifyTokenExpire > Date.now()) {
    const info = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verifyToken: null,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "User verified.", user: info, status: 200 });
  }
  return res.status(400).json({ error: "Invalid token.", status: 400 });
};

const handleUserSendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found." });
  }
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).json({ message: "verify email sent." });
};

// reset password
const handleUserSendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "user not found." });
  }
  await createMailSystem({ address: email, type: "reset", _id: user._id });
  return res.status(200).json({ message: "reset email sent." });
};

const handleUserResetPassword = async (req, res) => {
  const { TOKEN } = req.query;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: TOKEN });
  if (!user) {
    return res.status(400).json({ error: "Invalid token." });
  }
  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ error: "Token expired." });
  }
  const salt = await bcrypt.genSalt(10);
  const hexcode = await bcrypt.hash(password.trim(), salt);
  const info = await User.findByIdAndUpdate(
    user._id,
    {
      password: hexcode,
      resetToken: null,
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Password reset successful.", user: info });
};

const handleGetOneUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("roleInfo.company");
  if (!user) {
    return res.status(400).json({ error: "invailid user id." });
  }
  return res.status(200).json({ user: user, message: "user populated!" });
};

const handleGetUserByCompanyId = async (req, res) => {
  const { companyId } = req.params;
  const users = await User.find({
    roleInfo: {
      $elemMatch: {
        company: companyId,
        role: { $in: ["employee", "manager"] },
      },
    },
  });
  if (users.length > 0) {
    return res
      .status(200)
      .send({ message: "employee & manager in company!", users: users });
  }
  return res.status(400).send({ error: "invalid company id!" });
};

const handleGoogleCallback = async (req, res) => {
  const { code } = req.body;
  const tokens = await getToken(code);
  if (!tokens) {
    return res.status(400).send({ type: "error", msg: "Invalid token!" });
  }
  if (tokens.error) {
    return res.status(400).send({ type: "error", msg: tokens.error });
  }
  const { email, email_verified, given_name, family_name, picture } = getInfo(
    tokens.id_token
  );
  if (!email_verified) {
    return res.status(400).send({ type: "error", msg: "Email not verified!" });
  }
  const userCheck = await User.findOne({ email: email });
  if (userCheck) {
    req.user = userCheck;
    if (userCheck.roleInfo.length !== 0) {
      const company = await Company.findById(userCheck.roleInfo[0].company);
      if (company) {
        const roleInfo = userCheck.roleInfo[0];
        userCheck.company = {
          _id: company._id,
          name: company.name,
          role: roleInfo.role,
          branch: roleInfo.branch,
        };
      }
    }
    const token = setUser(userCheck);
    res.cookie("JWT_TOKEN", token, cookieOptions());
    return res.status(200).send({
      type: "success",
      msg: `${given_name} welcome to pay-insight!`,
      user: userCheck,
    });
  }
  const password = generateRandomString(8, true);
  const user = new User({
    givenName: given_name,
    familyName: family_name,
    email: email,
    isVerified: email_verified,
    password: password,
    picture: picture,
  });
  await user.save();
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, cookieOptions());
  await createMailSystemForEmployee({
    address: user.email,
    _id: user._id,
    password,
  });
  return res.status(200).send({
    type: "success",
    msg: `${given_name} welcome to pay-insight!`,
    user: user,
  });
};

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
  handleUserVerify,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
  handleGetOneUser,
  handleGetUserByCompanyId,
  handleUserSignUpWithRoles,
  handleGoogleCallback,
};
