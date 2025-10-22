import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Checkout from "./checkout";
import type { SubscriptionType } from "@/types/res-type";

const plans = [
  {
    _id: "001",
    duration: "1 month",
    durationDays: 30,
    price: 2,
  },
  {
    _id: "002",
    duration: "3 month",
    durationDays: 90,
    price: 6,
  },
  {
    _id: "003",
    duration: "6 month",
    durationDays: 180,
    price: 11,
  },
  {
    _id: "004",
    duration: "1 year",
    durationDays: 365,
    price: 21,
  },
] as PlanType[];

type ResponseType = {
  orderInfo: OrderType;
  message: string;
};

type SubscriptionResponseType = {
  subscription: SubscriptionType;
  message: string;
};

type PlanType = {
  _id: string;
  duration: string;
  durationDays: number;
  price: number;
};
export type OrderType = {
  _id: string;
  customer_id: string;
  amount: string;
  redirectUrl: string;
};

const Subscription = () => {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null
  );
  const handleCreatePaymentRequiest = (plan: PlanType) => {
    axios
      .post<ResponseType>("/api/payment/create", plan)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data.orderInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGetSubscription = () => {
    axios
      .get<SubscriptionResponseType>("/api/payment/subscription")
      .then((res) => {
        console.log(res.data);
        setSubscription(res.data.subscription);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleGetSubscription();
  }, []);
  if (order) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <div className="flex justify-center items-center">
          <Checkout orderInfo={order} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div>
        <h3>current subscription</h3>
        <h4>
          <span>type : </span>
          <span>{subscription?.type}</span>
        </h4>
        <p>
          <span>expire : </span>
          <span>
            {subscription?.proExpire
              ? new Date(subscription?.proExpire).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "never"}
          </span>
        </p>
        <p>
          <span>upcoming plan : </span>
          <span>{subscription?.upcoming.length}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="p-4">choose a plan!</div>
        <div className="flex justify-center flex-wrap gap-2">
          {plans.map((plan: PlanType) => (
            <div
              key={plan._id}
              className="flex flex-col justify-center items-center gap-4 bg-accent w-32 h-40"
            >
              <div>{plan.duration}</div>
              <Button
                onClick={() => handleCreatePaymentRequiest(plan)}
                variant="outline"
              >
                {plan.price} &#x20B9;
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
