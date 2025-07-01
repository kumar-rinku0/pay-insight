import express from "express";
import {
  handleGetPaymentStauts,
  handleCreatePaymentRequest,
  handleConfirmationPaymentRequest,
} from "../service/razorpay.js";

const router = express.Router();

router.post("/create", handleCreatePaymentRequest);
router.post("/confirmation", handleConfirmationPaymentRequest);
router.get("/status", handleGetPaymentStauts);

export default router;
