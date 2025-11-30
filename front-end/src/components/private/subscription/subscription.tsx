import axios from "axios";
import { useEffect, useState } from "react";
import type { SubscriptionType } from "@/types/res-type";
import { Link } from "react-router";
type SubscriptionResponseType = {
  subscription: SubscriptionType;
  message: string;
};

const Subscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null
  );
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

  if (!subscription) {
    return (
      <div className="flex h-[60vh] flex-col justify-center items-center p-4">
        <p>Loading subscription...</p>
      </div>
    );
  }
  const isExpired = new Date(subscription.proExpire) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <section className="bg-blue-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold">Your Subscription</h1>
            <p className="mt-3 text-lg opacity-90">
              Manage your Pro plan and billing details.
            </p>
          </div>

          <a
            href="/app/subscription/orders"
            className="text-white underline hover:text-gray-200 transition text-lg"
          >
            Payment History
          </a>
        </div>
      </section>

      {/* Subscription Card */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
          {/* Company */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Company</h2>
            <p className="mt-1 text-lg font-medium">
              {subscription.company.name}
            </p>
          </div>

          <hr className="my-6" />

          {/* Subscription Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Subscription Type
              </h3>
              <p className="mt-1 text-gray-900 font-medium capitalize">
                {subscription.type}
              </p>

              <h3 className="text-lg font-semibold text-gray-700 mt-5">
                Pro Status
              </h3>
              <p
                className={`mt-1 font-medium ${
                  subscription.pro ? "text-green-600" : "text-red-600"
                }`}
              >
                {subscription.pro ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Expiration Date
              </h3>
              <p className="mt-1 text-gray-900 font-medium">
                {new Date(subscription.proExpire).toLocaleDateString()}
              </p>

              <h3 className="text-lg font-semibold text-gray-700 mt-5">
                Upcoming Renewals
              </h3>

              {subscription.upcoming.length > 0 ? (
                <ul className="mt-2 list-disc ml-6 text-gray-700">
                  {subscription.upcoming.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-gray-500">No upcoming renewals.</p>
              )}
            </div>
          </div>

          {/* Message */}
          {/* {subscription.message && (
            <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
              {subscription.message}
            </div>
          )} */}

          {/* Expiration Warning */}
          {isExpired && (
            <div className="mt-8 p-5 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-xl">
              <h3 className="font-semibold text-lg">
                Your Pro Subscription Has Expired
              </h3>
              <p className="mt-1">
                To continue adding more than 5 staff members and access premium
                features, please renew your plan.
              </p>

              <Link to="/app/subscription/plans">
                <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Renew Subscription
                </button>
              </Link>
            </div>
          )}

          {/* Active Subscription CTA */}
          {!isExpired && (
            <div className="mt-8 p-5 bg-green-100 text-green-800 border border-green-300 rounded-xl">
              <h3 className="font-semibold text-lg">
                Your Subscription is Active
              </h3>
              <p className="mt-1">
                Enjoy unlimited staff, advanced tracking, reports, and more.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-blue-600 text-white text-center py-5">
        © {new Date().getFullYear()} Staff Management App. All Rights Reserved.
      </footer> */}
    </div>
  );
};

export default Subscription;
