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
  customer_id: string;
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
    const paymentBtn = document.querySelector("#paymentBTN");
    if (paymentBtn) {
      paymentBtn.appendChild(script);
    }
  });
};

const Checkout = ({ orderInfo }: { orderInfo: OrderType }) => {
  const CLIENT_ID = import.meta.env.VITE_RAZORPAY_CLIENT_ID;
  console.log(CLIENT_ID);

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }
  };

  const handleRazorPayClick = async () => {
    const options = {
      key: CLIENT_ID, // Replace with your Razorpay key
      order_id: orderInfo._id,
      amount: orderInfo.amount, // in paise
      currency: "INR",
      name: "Rinku Kumar",
      description: "pay it.",
      image:
        "https://rinkukumar.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frinku_sign.ec451a48.png&w=96&q=100",
      customer_id: orderInfo.customer_id,
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
        axios.post("/api/payment/confirmation", response).finally(() => {
          location.assign(`/status?orderId=${response.razorpay_order_id}`);
        });
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
    };
    if (orderInfo && CLIENT_ID) {
      await displayRazorpay();
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert(response.error.description);
        location.assign(`/status?orderId=${orderInfo._id}`);
      });
      paymentObject.open();
    } else {
      alert("Missing ORDERID OR CLIENTID!");
    }
  };

  return (
    <Button id="paymentBTN" onClick={handleRazorPayClick}>
      Pay
    </Button>
  );
};

export default Checkout;
