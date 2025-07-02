import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleCreateBranch,
  handleFetchBranches,
  handleGetBranchInfo,
} from "../controller/branch.js";
import { onlyAdminUser } from "../middleware/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/create").post(onlyAdminUser, wrapAsync(handleCreateBranch));
route.route("/info").get(wrapAsync(handleGetBranchInfo));
route.route("/company").get(wrapAsync(handleFetchBranches));

export default route;
