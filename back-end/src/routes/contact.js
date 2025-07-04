import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import { handleCreateContact } from "../controllers/contact.js";

const router = Router();

router.post("/create", wrapAsync(handleCreateContact));

export default router;
