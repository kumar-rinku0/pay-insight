import express from "express";
import {
  handleGetPaymentStauts,
  handleCreatePaymentRequest,
  handleConfirmationPaymentRequest,
  handleRazorpayWebhook,
} from "../services/razorpay.js";
import wrapAsync from "../utils/wrap-async.js";
import {
  getSubscriptionByUser,
  isProCompany,
} from "../controllers/subscription.js";
import { handleGetPaymentsInitiatedBy } from "../controllers/payment.js";
import { onlyLoggedInUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", onlyLoggedInUser, wrapAsync(handleCreatePaymentRequest));
router.post(
  "/confirmation",
  onlyLoggedInUser,
  wrapAsync(handleConfirmationPaymentRequest)
);
router.get("/status", onlyLoggedInUser, wrapAsync(handleGetPaymentStauts));

// payment webhook non-protected
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  wrapAsync(handleRazorpayWebhook)
);

// subscription
router.get(
  "/subscription",
  onlyLoggedInUser,
  wrapAsync(isProCompany),
  wrapAsync(getSubscriptionByUser)
);

// payments initiated by user
router.get(
  "/initiatedBy/:initiatedBy",
  onlyLoggedInUser,
  wrapAsync(handleGetPaymentsInitiatedBy)
);

export default router;
