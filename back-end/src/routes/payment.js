import express from "express";
import {
  handleGetPaymentStauts,
  handleCreatePaymentRequest,
  handleConfirmationPaymentRequest,
} from "../services/razorpay.js";
import wrapAsync from "../utils/wrap-async.js";
import {
  getSubscriptionByUser,
  isProCompany,
} from "../controllers/subscription.js";
import {
  handleGetPaymentsInitiatedBy,
  handleWebhook,
} from "../controllers/payment.js";

const router = express.Router();

router.post("/create", wrapAsync(handleCreatePaymentRequest));
router.post("/confirmation", wrapAsync(handleConfirmationPaymentRequest));
router.get("/status", wrapAsync(handleGetPaymentStauts));

// payment webhook
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  wrapAsync(handleWebhook)
);

// subscription
router.get(
  "/subscription",
  wrapAsync(isProCompany),
  wrapAsync(getSubscriptionByUser)
);

// payments initiated by user
router.get("/initiatedBy/:userId", wrapAsync(handleGetPaymentsInitiatedBy));

export default router;
