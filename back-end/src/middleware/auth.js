// user is logged in or not check.
import { getUser } from "../util/jwt.js";

const isLoggedInCheck = (req, res, next) => {
  const user = req.session.user;
  req.user = user;
  return next();
};

const onlyLoggedInUser = (req, res, next) => {
  // req.session.originalUrl = req.originalUrl;
  let user = req.user;
  if (!user || user == null) {
    user = req.session.user;
    req.user = user;
  }
  if (!user) {
    return res
      .status(400)
      .send({ origin: "middleware", type: "error", error: "login to access!" });
  }
  return next();
};

const onlyAdminUser = (req, res, next) => {
  let user = req.user;
  if (!user || user == null) {
    user = req.session.user;
    req.user = user;
  }
  console.log(user);
  if (!user.role) {
    return res.status(400).send({
      origin: "middleware",
      type: "error",
      error: "company not found!",
    });
  }
  if (user.role.role !== "admin") {
    return res
      .status(400)
      .send({ origin: "middleware", type: "error", error: "not an admin!" });
  }
  return next();
};

const onlyAdminOrManagerUser = (req, res, next) => {
  let user = req.user;
  if (!user || user == null) {
    user = req.session.user;
    req.user = user;
  }
  if (!user.role) {
    return res.status(400).send({
      origin: "middleware",
      type: "error",
      error: "company not found!",
    });
  }

  // check if the user is admin or manager
  if (user.role.role === "employee") {
    return res.status(400).send({
      origin: "middleware",
      type: "error",
      error: "not an admin or manager!",
    });
  }
  return next();
};

export {
  isLoggedInCheck,
  onlyLoggedInUser,
  onlyAdminUser,
  onlyAdminOrManagerUser,
};
