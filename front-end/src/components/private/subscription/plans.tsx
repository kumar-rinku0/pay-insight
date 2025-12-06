import { useAuth } from "@/providers/use-auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type PlanType = {
  _id: string;
  duration: string;
  durationDays: number;
  price: number;
  tag: string;
};
export type OrderType = {
  id: string;
  amount: string;
  status: string;
  attempts: number;
};

type ResponseType = {
  orderInfo: OrderType;
  message: string;
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

const proBenefits = [
  "Add unlimited staff members",
  "Advanced attendance tracking",
  "Shift scheduling tools",
  "Performance analytics dashboard",
  "Priority support",
  "Export detailed reports",
];

const Plans = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    navigate("/login");
  }
  const handleCreatePaymentRequest = (plan: PlanType) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role.role === "employee") {
      toast.error("Only admins & managers can purchase subscription plans.");
      return;
    }
    axios
      .post<ResponseType>("/api/payment/create", plan)
      .then((res) => {
        console.log(res.data);
        // setOrder(res.data.orderInfo);
        navigate(`/app/subscription/payment?orderId=${res.data.orderInfo.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      {/* Subscription Plans */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Pro Subscription Plans
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
                  onClick={() => handleCreatePaymentRequest(plan)}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
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
    </div>
  );
};

export default Plans;
