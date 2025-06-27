import express from "express";
import {
  handleCreatePaymentRequest,
  handleGetPaymentStauts,
} from "../service/checkout.js";

const router = express.Router();

router.post("/create", handleCreatePaymentRequest);
router.get("/status", handleGetPaymentStauts);

export default router;
