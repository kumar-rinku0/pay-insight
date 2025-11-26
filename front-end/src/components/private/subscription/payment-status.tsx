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
          console.log(res.data.orderInfo);
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
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
      {order && order.attempts !== 0 && <div> Payment Failed.</div>}
      {order && <Checkout orderInfo={order} />}
    </div>
  );
};

export default PayStatus;
