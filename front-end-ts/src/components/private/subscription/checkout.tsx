import React, { useEffect } from "react";
import type { OrderType } from "./subscription";
import { Button } from "@/components/ui/button";
import axios from "axios";

type RazorpayOptions = {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string | null;
  callback_url: string;
  notes?: Record<string, unknown>;
  theme?: {
    color: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: ErrorProp) => void) => void;
};

type ErrorProp = {
  error: {
    code: string;
    description: string;
    reason: string;
    source: string;
  };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout: React.FC<OrderType> = (orderInfo) => {
  const CLIENT_ID = import.meta.env.VITE_RAZORPAY_CLIENT_ID;
  console.log(CLIENT_ID);
  useEffect(() => {
    const displayRazorpay = async () => {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Razorpay SDK failed to load.");
        return;
      }
    };

    if (orderInfo && CLIENT_ID) {
      displayRazorpay();
    } else {
      alert("Missing ORDERID OR CLIENTID in URL query parameters!");
    }
  }, [orderInfo, CLIENT_ID]);

  const handleRazorPayClick = () => {
    const options = {
      key: CLIENT_ID, // Replace with your Razorpay key
      order_id: orderInfo._id,
      amount: orderInfo.amount, // in paise
      currency: "INR",
      name: "Rinku Kumar",
      description: "Transaction",
      image: "https://example.com/your_logo",
      callback_url: orderInfo.redirectUrl,
      notes: {
        address: "Razorpay Corporate Office",
      },
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        // alert(response.razorpay_payment_id);
        console.log(response);
        axios.post("/api/payment/confirmation", response).then(() => {
          location.assign(`/status?orderId=${response.razorpay_order_id}`);
        });
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      alert(response.error.description);
      location.assign(`/status?orderId=${orderInfo._id}`);
    });
    paymentObject.open();
  };

  return (
    <div>
      <div>checkout to pay</div>
      <Button onClick={handleRazorPayClick}>Pay</Button>
    </div>
  );
};

export default Checkout;
