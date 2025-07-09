import express from "express";
import {
  handleGetPaymentStauts,
  handleCreatePaymentRequest,
  handleConfirmationPaymentRequest,
} from "../services/razorpay.js";
import { getSubscriptionByUser } from "../controllers/subscription.js";

const router = express.Router();

router.post("/create", handleCreatePaymentRequest);
router.post("/confirmation", handleConfirmationPaymentRequest);
router.get("/status", handleGetPaymentStauts);
router.get("/subscription", getSubscriptionByUser);

export default router;
