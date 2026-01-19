import { Router } from "express";
import wrapAsync from "../utils/wrap-async.js";
import { handleCreateContact } from "../controllers/contact.js";
import { handleUploadImage } from "../utils/cloud-init.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/create", wrapAsync(handleCreateContact));

router
  .route("/upload/img")
  .post(
    upload.single("upload_img"),
    wrapAsync(handleUploadImage),
    handleImageUpload,
  );

export default router;

const handleImageUpload = (req, res) => {
  const url = req.url;
  if (!url) {
    return res.status(400).json({ ok: false, message: "img upload failed." });
  }
  return res.status(200).json({ ok: true, message: "img uploaded." });
};
