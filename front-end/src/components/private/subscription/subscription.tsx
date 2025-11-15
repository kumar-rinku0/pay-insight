import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Checkout from "./checkout";
import type { SubscriptionType } from "@/types/res-type";

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

type ResponseType = {
  orderInfo: OrderType;
  message: string;
};

type SubscriptionResponseType = {
  subscription: SubscriptionType;
  message: string;
};

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

const Subscription = () => {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null
  );
  const handleCreatePaymentRequest = (plan: PlanType) => {
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
      {!subscription && <p>Loading subscription...</p>}
      {subscription && subscription.pro && subscription.type === "pro" && (
        <div className="mb-4 p-4 bg-green-200 text-green-800">
          You are currently on a Pro plan. Thank you for being a valued
          customer!
        </div>
      )}
      {subscription && !subscription.pro && subscription.type === "pro" && (
        <div className="mb-4 p-4 bg-red-200 text-red-800">
          Your Pro subscription has expired. Please choose a plan to continue
          enjoying Pro features.
        </div>
      )}
      <div className="flex flex-col justify-center items-center">
        <div className="mb-4">choose a plan</div>
        <div className="flex justify-center flex-wrap gap-2">
          {plans.map((plan: PlanType) => (
            <div
              key={plan._id}
              className="flex flex-col justify-center items-center gap-4 bg-accent w-32 h-40"
            >
              <div>{plan.duration}</div>
              <Button
                onClick={() => handleCreatePaymentRequest(plan)}
                variant="outline"
              >
                {plan.price} &#x20B9;
              </Button>
            </div>
          ))}
        </div>
      </div>
      {subscription && (
        <div className="mt-8 p-4 border-t w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">current subscription</h3>
          <h4 className="font-semibold">
            <span>type : </span>
            <span>
              {subscription?.type === "pro"
                ? subscription.pro
                  ? "Pro"
                  : "Pro (expired)"
                : "Free"}
            </span>
          </h4>
          <p>
            <span>expire : </span>
            <span className="font-monospace">
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
      )}
    </div>
  );
};

export default Subscription;
