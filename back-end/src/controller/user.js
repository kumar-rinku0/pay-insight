import Company from "../model/company.js";
import User from "../model/user.js";
import { setUser } from "../util/jwt.js";
import bcrypt from "bcryptjs";
import { createMailSystem, createMailSystemForEmployee } from "../util/mail.js";
import {
  generateRandomString,
  isRightUser,
  cookieOptions,
  cookieOptionsForRemember,
} from "../util/functions.js";
import { getToken } from "../util/auth.js";
import { getInfo } from "../util/jwt.js";
import Role from "../model/role.js";

// login, logout & create user
const handleUserSignUp = async (req, res) => {
  const { givenName, familyName, email, password } = req.body;
  // const userbyemail = await User.findOne({ email });
  // if (userbyemail) {
  //   return res
  //     .status(400)
  //     .send({ error: "user already exist.", user: userbyemail });
  // }
  const user = new User({
    name: `${givenName} ${familyName}`,
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
  const { company, name, role: userRole } = req.user.role;
  if (userRole === "manager" && role === "admin") {
    return res
      .status(401)
      .send({ error: "you are not allowed to create admin!" });
  }
  const userbyemail = await User.findOne({ email }).exec();
  if (userbyemail) {
    const info = await Role.find({
      $and: [{ user: userbyemail._id }, { company: company }],
    });
    if (!info) {
      const newRole = new Role({
        user: userbyemail._id,
        company: company,
        name: name,
        branch: branchId,
        role: role,
      });
      userbyemail.roles.push(newRole);
      await newRole.save();
      await userbyemail.save();

      return res.status(200).send({
        message: "staff assigned a role!",
        user: userbyemail,
        role: newRole,
      });
    }

    return res.status(200).send({
      message: "already assigned a role!",
      user: userbyemail,
      role: info,
    });
  }
  const password = generateRandomString(8, true);
  const user = new User({
    name: `${givenName} ${familyName}`,
    email,
    password,
  });
  console.log(password);
  const newRole = new Role({
    user: user._id,
    company: company,
    name: name,
    branch: branchId,
    role: role,
  });
  await newRole.save();
  user.roles.push(newRole);
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
  const role = await Role.findOne({ user: user._id });
  const token = setUser(user, role);
  res.cookie("JWT_TOKEN", token, cookieOptions());

  return res.status(200).json({
    user: user,
    role: role,
    message: "login successful. if user have company it will be in user!",
  });
};

const handleRememberMe = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ error: "user not found." });
  }
  const token = setUser(user, 7);
  res.cookie("JWT_TOKEN", token, cookieOptionsForRemember());
  return res.status(200).json({
    user: user,
    message: "session extended for 7 days.",
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

export const handleUserDelete = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findByIdAndDelete(userid);
  return res
    .status(200)
    .json({ message: "User deleted successfully.", user: user });
};

// Exporting all the functions

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
  handleUserVerify,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
  handleUserSignUpWithRoles,
  handleGoogleCallback,
  handleRememberMe,
};
