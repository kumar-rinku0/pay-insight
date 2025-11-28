import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Checkout from "./checkout";
import type { OrderType } from "./subscription";

const PayStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [state, setState] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/payment/status?orderId=${orderId}`)
        .then((res) => {
          // console.log(res.data.orderInfo);
          setState(res.data.state);
          setOrder(res.data.orderInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [orderId]);
  if (!state) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (state === "COMPLETED") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div> Payment Completed.</div>
      </div>
    );
  }
  if (state === "ORDER_NOT_FOUND") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div> Order Not Found.</div>
      </div>
    );
  }

  if (order?.attempts && order.attempts !== 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
        <div> Payment Failed.</div>
        {order && <Checkout orderInfo={order} />}
      </div>
    );
  }

  return (
    // <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Secure Checkout
        </h2>

        {/* Order Summary */}
        <div className="flex justify-between text-lg font-medium mb-6">
          <span className="text-gray-600">Order Total</span>
          <span className="font-bold">
            {(Number(order?.amount) / 100).toFixed(2)}
          </span>
        </div>
        <div className="w-full flex justify-end">
          {order && <Checkout orderInfo={order} />}
        </div>
        {/* {order && order.attempts !== 0 && <div> Payment Failed.</div>} */}

        <p className="text-center text-sm text-gray-500 mt-4">
          🔒 Payment is encrypted and secure
        </p>
      </div>
    </div>
    // </div>
  );
};

export default PayStatus;
