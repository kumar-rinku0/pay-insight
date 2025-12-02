import React from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/providers/use-auth";

type PlanType = {
  _id: string;
  duration: string;
  durationDays: number;
  price: number;
  tag: string;
};

const plans = [
  {
    _id: "001",
    duration: "1 Month",
    durationDays: 30,
    price: 49,
    tag: "Starter",
  },
  {
    _id: "002",
    duration: "3 Months",
    durationDays: 90,
    price: 129,
    tag: "Popular",
  },
  {
    _id: "003",
    duration: "6 Months",
    durationDays: 180,
    price: 249,
    tag: "Best Value",
  },
  {
    _id: "004",
    duration: "1 Year",
    durationDays: 365,
    price: 449,
    tag: "Ultimate",
  },
] as PlanType[];

const Home: React.FC = () => {
  const router = useNavigate();
  const { isAuthenticated } = useAuth();

  const proBenefits = [
    "Add unlimited staff members",
    "Advanced attendance tracking",
    "Shift scheduling tools",
    "Performance analytics dashboard",
    "Priority support",
    "Export detailed reports",
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Staff Management Made Simple
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Manage your team with powerful tools designed for efficiency. Add
            staff, track attendance, assign shifts, and more — all in one place.
          </p>
          <p className="mt-6 text-lg bg-white text-blue-700 py-2 px-6 rounded-full inline-block font-semibold shadow-md">
            Adding 5+ staff requires a Pro Subscription
          </p>
        </div>
      </section>

      {/* root section */}
      <div className="bg-[#f2fafc] dark:bg-transparent h-full md:min-h-[80vh] w-full flex flex-col justify-center lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 lg:min-h-1/2 flex flex-col gap-4 text-center sm:text-start sm:gap-8 justify-center px-8 lg:px-16 xl:px-32 py-4">
          <h3 className="text-3xl font-semibold">Simplify Staff Management</h3>
          <p className="text-sm">
            Meet the smartest staff management system to manage attendance,
            payroll, compliances, and much more.
          </p>
          {isAuthenticated ? (
            <Link to="/app" className="self-center w-60">
              <Button
                variant="outline"
                className="cursor-pointer w-full h-full"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register" className="self-center w-60">
              <Button
                className="cursor-pointer w-full h-full"
                variant="secondary"
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
        <div className="w-full lg:w-1/2 flex items-center ">
          <div className="w-full relative h-96">
            <img
              src="/a2.png"
              alt="attendance img"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Pro Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Why Go Pro?
          </h2>

          <ul className="grid md:grid-cols-2 gap-6 mt-10">
            {proBenefits.map((benefit, index) => (
              <li
                key={index}
                className="bg-white p-5 rounded-xl shadow flex items-start gap-3"
              >
                <span className="text-blue-600 text-2xl">✔</span>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Pro Subscription Plans
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
              >
                <p className="text-blue-600 font-semibold">{plan.tag}</p>

                <h3 className="text-2xl font-bold mt-2">{plan.duration}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  &#x20B9;{plan.price}
                </p>

                <ul className="mt-6 text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> Unlimited Staff
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> All Pro Features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> Priority Support
                  </li>
                </ul>

                <button
                  className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={() =>
                    isAuthenticated
                      ? router("/app/subscription/plans")
                      : router("/register")
                  }
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
