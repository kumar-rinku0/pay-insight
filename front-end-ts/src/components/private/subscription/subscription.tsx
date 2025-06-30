import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import Checkout from "./checkout";

const plans = [
  {
    id: "001",
    duration: "1 month",
    price: "2",
  },
  {
    id: "002",
    duration: "3 month",
    price: "6",
  },
  {
    id: "003",
    duration: "6 month",
    price: "11",
  },
  {
    id: "004",
    duration: "1 year",
    price: "21",
  },
];

type ResponseType = {
  orderInfo: OrderType;
  message: string;
};

export type OrderType = {
  _id: string;
  amount: string;
  redirectUrl: string;
};

const Subscription = () => {
  const [order, setOrder] = useState<OrderType | null>(null);
  const handleCreatePaymentRequiest = (amount: string) => {
    axios
      .post<ResponseType>("/api/payment/create", { amount: amount })
      .then((res) => {
        console.log(res.data);
        setOrder(res.data.orderInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (order) {
    return <Checkout {...order} />;
  }
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="p-4">choose a plan!</div>
      <div className="flex justify-center flex-wrap gap-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-center items-center gap-4 bg-accent w-32 h-40"
          >
            <div>{plan.duration}</div>
            <Button
              onClick={() => handleCreatePaymentRequiest(plan.price)}
              variant="outline"
            >
              {plan.price} &#x20B9;
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
