import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
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
} from "../controller/user.js";
import {
  onlyLoggedInUser,
  onlyAdminOrManagerUser,
} from "../middleware/auth.js";

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
  .delete(onlyLoggedInUser, wrapAsync(handleUserDelete));

route.post("/google/callback", wrapAsync(handleGoogleCallback));

route
  .route("/registerbyrole")
  .post(
    onlyLoggedInUser,
    onlyAdminOrManagerUser,
    wrapAsync(handleUserSignUpWithRoles)
  );

route
  .route("/remember/userId/:userId")
  .patch(onlyLoggedInUser, wrapAsync(handleRememberMe));

export default route;
