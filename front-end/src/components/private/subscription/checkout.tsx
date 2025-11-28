import { Spinner } from "@/components/ui/spinner";
import type { OrderType } from "./subscription";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

type RazorpayOptions = {
  key: string;
  amount: string;
  currency: string;
  name: string;
  // description: string;
  image: string;
  order_id: string | null;
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
  const [loading, setLoading] = useState(false);
  const CLIENT_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

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
      key: CLIENT_ID!, // Public key
      order_id: orderInfo.id,
      amount: orderInfo.amount, // in paise
      currency: "INR",
      name: "Rinku Kumar",
      image:
        "https://rinkukumar.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frinku_sign.ec451a48.png&w=96&q=100",
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        // alert(response.razorpay_payment_id);
        console.log(response);
        axios.post("/api/payment/confirmation", response).finally(() => {
          location.assign(
            `/app/subscription/payment?orderId=${response.razorpay_order_id}`
          );
        });
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
        escape: true,
        confirm_close: false,
      },
      retry: {
        enabled: false,
      },
      timeout: 300,
      theme: {
        color: "#1c2938",
        backdrop_color: "#1c293888",
      },
      remember_customer: true,
    };
    if (orderInfo && CLIENT_ID) {
      setLoading(true);
      await displayRazorpay();
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error(response.error.description);
        location.assign(`/app/subscription/payment?orderId=${orderInfo.id}`);
      });
      paymentObject.open();
    } else {
      toast.error("Missing ORDERID OR CLIENTID!");
    }
  };

  return (
    <Button
      id="paymentBTN"
      onClick={handleRazorPayClick}
      variant="secondary"
      className="size-12 w-fit flex justify-between"
      disabled={loading}
    >
      {loading ? (
        <span className="w-40 flex gap-1 items-center">
          <Spinner className="mr-2" />
          Processing...
        </span>
      ) : (
        <span className="w-40 flex gap-1 items-center">Pay </span>
      )}
      <span>&#8377; {Number(orderInfo.amount) / 100}</span>
    </Button>
  );
};

export default Checkout;
