import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const PayStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [state, setState] = useState<string | null>(null);
  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/payment/status?orderId=${orderId}`)
        .then((res) => {
          console.log(res);
          setState(res.data.state);
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
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div> Payment Failed, Try Again!</div>
    </div>
  );
};

export default PayStatus;
