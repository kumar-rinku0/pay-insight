import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleGetOneUserRoles,
  handleGetEmployeeRoles,
} from "../controller/role.js";
import { onlyAdminUser } from "../middleware/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/userId/:userId").get(wrapAsync(handleGetOneUserRoles));

route
  .route("/employee/companyId/:companyId")
  .get(onlyAdminUser, wrapAsync(handleGetEmployeeRoles));

export default route;
