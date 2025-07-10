import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  onlyOneBranchAccess,
  handleCreateBranch,
  handleFetchBranches,
  handleGetBranchInfo,
} from "../controllers/branch.js";
import { onlyAdminUser } from "../middlewares/auth.js";
import { isProUser } from "../controllers/subscription.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route
  .route("/create")
  .post(
    onlyAdminUser,
    wrapAsync(isProUser),
    wrapAsync(onlyOneBranchAccess),
    wrapAsync(handleCreateBranch)
  );
route.route("/info").get(wrapAsync(handleGetBranchInfo));
route.route("/company").get(wrapAsync(handleFetchBranches));

export default route;
