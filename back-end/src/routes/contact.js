import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import { handleCreateContact } from "../controllers/contact.js";
import {
  handleUploadImage,
  handleReturnImageUpload,
} from "../utils/cloud-init.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/create", wrapAsync(handleCreateContact));

router
  .route("/upload/img")
  .post(
    upload.single("upload_img"),
    wrapAsync(handleUploadImage),
    handleReturnImageUpload,
  );

export default router;
