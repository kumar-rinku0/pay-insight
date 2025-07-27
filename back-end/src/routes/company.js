import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
  handleSelectCompany,
  handleUpdateCompanyById,
  handleDeleteCompanyById,
} from "../controllers/company.js";
import { onlyAdminUser, onlyLoggedInUser } from "../middlewares/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/create").post(wrapAsync(handleCreateCompany));
route
  .route("/select-rolebased-company/roleid/:roleid")
  .get(wrapAsync(handleSelectCompany));

route
  .route("/getOneByCompanyId/:companyId")
  .get(wrapAsync(handleGetCompanyById));

route
  .route("/update/companyId/:companyId")
  .put(onlyLoggedInUser, onlyAdminUser, wrapAsync(handleUpdateCompanyById));
route
  .route("/delete/companyId/:companyId")
  .delete(onlyLoggedInUser, onlyAdminUser, wrapAsync(handleDeleteCompanyById));

route.route("/userId/:userId").get(wrapAsync(handleFetchCompanies));

export default route;
