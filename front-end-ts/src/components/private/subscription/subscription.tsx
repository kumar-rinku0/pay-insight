import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";

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

const Subscription = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
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
            <Button variant="outline">{plan.price} &#x20B9;</Button>
          </div>
        ))}
      </div>
      <PayPalScriptProvider
        options={{
          clientId: CLIENT_ID,
          components: "buttons",
        }}
      >
        {/* Replace 'YOUR_PLAN_ID' with your actual PayPal subscription plan ID */}
        <div id="paypal-button-container" className="mt-4">
          <PayPalButtons
            style={{ layout: "vertical" }}
            createSubscription={(
              data: Record<string, unknown>,
              actions: {
                subscription: {
                  create: (opts: { plan_id: string }) => Promise<string>;
                };
              }
            ) => {
              console.log(data);
              return actions.subscription.create({
                plan_id: "YOUR_PLAN_ID",
              });
            }}
            onApprove={async (data) => {
              const subscriptionID = data.subscriptionID ?? "unknown";
              alert("You have successfully subscribed to " + subscriptionID);
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
};

export default Subscription;
