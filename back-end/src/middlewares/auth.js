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
      .status(401)
      .send({ code: "Unauthorized", message: "Unauthorized!" });
  }
  return next();
};

const onlyAdminUser = (req, res, next) => {
  let user = req.user;
  if (!user || user == null) {
    user = req.session.user;
    req.user = user;
  }
  if (!user.role) {
    return res.status(403).send({
      code: "Forbidden",
      message: "Forbidden!",
    });
  }
  if (user.role.role !== "admin") {
    return res
      .status(400)
      .send({ code: "Forbidden", message: "Not an admin!" });
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
    return res.status(403).send({
      code: "Forbidden",
      message: "Forbidden!",
    });
  }

  // check if the user is admin or manager
  if (user.role.role === "employee") {
    return res.status(403).send({
      code: "Forbidden",
      message: "Not an admin or manager!",
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
