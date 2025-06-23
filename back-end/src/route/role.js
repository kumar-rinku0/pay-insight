import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleGetOneUserRoles,
  handleGetEmployeeRoles,
} from "../controller/role.js";
import { onlyAdminOrManagerUser } from "../middleware/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/userId/:userId").get(wrapAsync(handleGetOneUserRoles));

route
  .route("/employees")
  .get(onlyAdminOrManagerUser, wrapAsync(handleGetEmployeeRoles));

export default route;
