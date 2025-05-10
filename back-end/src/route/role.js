import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import { handleGetOneUserRoles } from "../controller/role.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/userId/:userId").get(wrapAsync(handleGetOneUserRoles));

export default route;
