import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  handleGetOneUserRoles,
  handleGetEmployeeRoles,
  onlyLimitedRolesAccess,
  handleDeleteCompanyRole,
  handleLeaveCompanyOrDeleteRole,
} from "../controllers/role.js";
import {
  onlyAdminOrManagerUser,
  onlyLoggedInUser,
} from "../middlewares/auth.js";
import { isProCompany } from "../controllers/subscription.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/userId/:userId").get(wrapAsync(handleGetOneUserRoles));
route
  .route("/delete")
  .delete(onlyLoggedInUser, wrapAsync(handleLeaveCompanyOrDeleteRole));
route
  .route("/delete/roleId/:roleId")
  .delete(onlyLoggedInUser, wrapAsync(handleDeleteCompanyRole));

route
  .route("/employees")
  .get(
    onlyAdminOrManagerUser,
    wrapAsync(isProCompany),
    wrapAsync(onlyLimitedRolesAccess),
    wrapAsync(handleGetEmployeeRoles)
  );

export default route;
