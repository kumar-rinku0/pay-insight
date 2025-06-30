import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { randomUUID } from "crypto";

const redirectUrl = process.env.DOMAIN;

export const handleCreatePaymentRequest = (req, res) => {
  const merchantOrderId = randomUUID();
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({
      message: "Invalid or missing amount.",
      type: "BadRequest",
    });
  }
  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(Number(amount) * 100)
    .redirectUrl(`${redirectUrl}/status?orderId=${merchantOrderId}`)
    .build();
  client
    .pay(request)
    .then((response) => {
      const checkoutPageUrl = response.redirectUrl;
      console.log(checkoutPageUrl);
      return res.status(200).json({ checkoutPageUrl: checkoutPageUrl });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "payment creation failed", status: 500 });
    });
};

export const handleGetPaymentStauts = (req, res) => {
  const { orderId } = req.query; //created at the time of order creation
  if (!orderId) {
    return res.status(404).json({ message: "bad request." });
  }
  client
    .getOrderStatus(orderId)
    .then((response) => {
      const state = response.state;
      return res.status(200).json({ message: "okay.", state: state });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message, status: 500 });
    });
};
