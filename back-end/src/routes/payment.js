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
import { handleGetPaymentsInitiatedBy } from "../controllers/payment.js";

const router = express.Router();

router.post("/create", wrapAsync(handleCreatePaymentRequest));
router.post("/confirmation", wrapAsync(handleConfirmationPaymentRequest));
router.get("/status", wrapAsync(handleGetPaymentStauts));

// subscription
router.get(
  "/subscription",
  wrapAsync(isProCompany),
  wrapAsync(getSubscriptionByUser)
);

// payments initiated by user
router.get(
  "/initiatedBy/:initiatedBy",
  wrapAsync(handleGetPaymentsInitiatedBy)
);

export default router;
