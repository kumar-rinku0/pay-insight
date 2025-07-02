import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  handleGetOneUserRoles,
  handleGetEmployeeRoles,
} from "../controllers/role.js";
import { onlyAdminOrManagerUser } from "../middlewares/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/userId/:userId").get(wrapAsync(handleGetOneUserRoles));

route
  .route("/employees")
  .get(onlyAdminOrManagerUser, wrapAsync(handleGetEmployeeRoles));

export default route;
