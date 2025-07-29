import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleUserVerify,
  handleUserLogout,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
  handleUserSignUpWithRoles,
  handleGoogleCallback,
  handleRememberMe,
  handleUserDelete,
  handleUserAccountDelete,
} from "../controllers/user.js";
import {
  onlyLoggedInUser,
  onlyAdminOrManagerUser,
  onlyAdminUser,
} from "../middlewares/auth.js";
import { isProCompany } from "../controllers/subscription.js";
import { onlyLimitedRolesAccess } from "../controllers/role.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/verify").get(wrapAsync(handleUserVerify));
route.route("/verify").post(wrapAsync(handleUserSendVerifyEmail));

route.route("/reset").post(wrapAsync(handleUserSendResetEmail));
route.route("/reset").put(wrapAsync(handleUserResetPassword));

route.route("/login").post(wrapAsync(handleUserSignIn));
route.route("/register").post(wrapAsync(handleUserSignUp));
route.route("/logout").get(onlyLoggedInUser, wrapAsync(handleUserLogout));

route
  .route("/delete/userid/:userid")
  .delete(onlyLoggedInUser, onlyAdminUser, wrapAsync(handleUserDelete));

route
  .route("/delete")
  .delete(onlyLoggedInUser, wrapAsync(handleUserAccountDelete));

route.post("/google/callback", wrapAsync(handleGoogleCallback));

route.route("/registerbyrole").post(
  onlyLoggedInUser,
  onlyAdminOrManagerUser,
  wrapAsync(isProCompany),
  wrapAsync(async (req, res, next) => {
    await onlyLimitedRolesAccess(req, res, next, 2);
  }),
  wrapAsync(handleUserSignUpWithRoles)
);

route.route("/remember").patch(onlyLoggedInUser, wrapAsync(handleRememberMe));

export default route;
