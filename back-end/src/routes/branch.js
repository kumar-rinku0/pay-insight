import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  onlyOneBranchAccess,
  handleCreateBranch,
  handleFetchBranches,
  handleGetBranchInfo,
  handleGetBranchInfoByBranchId,
  handleUpdateBranchInfoByBranchId,
  handleDeleteBranchByBranchId,
} from "../controllers/branch.js";
import { onlyAdminUser } from "../middlewares/auth.js";
import { isProCompany } from "../controllers/subscription.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route
  .route("/create")
  .post(
    onlyAdminUser,
    wrapAsync(isProCompany),
    wrapAsync(onlyOneBranchAccess),
    wrapAsync(handleCreateBranch)
  );

route.route("/info").get(wrapAsync(handleGetBranchInfo));

route
  .route("/update/branchId/:branchId")
  .put(onlyAdminUser, wrapAsync(handleUpdateBranchInfoByBranchId));

route
  .route("/delete/branchId/:branchId")
  .delete(onlyAdminUser, wrapAsync(handleDeleteBranchByBranchId));

route
  .route("/getOneByBranchId/:branchId")
  .get(wrapAsync(handleGetBranchInfoByBranchId));

route.route("/company").get(wrapAsync(handleFetchBranches));

export default route;
