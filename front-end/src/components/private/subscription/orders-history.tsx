import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/use-auth";
import type { PaymentType } from "@/types/res-type";
import { Button } from "@/components/ui/button";

type ResponseType = {
  payments: PaymentType[];
  message: string;
};

const OrdersHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentType[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      console.log(user);
      axios
        .get<ResponseType>(`/api/payment/initiatedBy/${user._id}`)
        .then((res) => {
          // console.log(res.data);
          setPayments(res.data.payments);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setPayments([]);
        });
    }
  }, [user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!payments) {
    return (
      <div className="flex flex-col justify-center items-center p-4">
        <p>No payments found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4">
      <h3 className="text-2xl font-bold">all payment initiated by you</h3>
      <div className="flex flex-wrap gap-4">
        {payments.map((payment) => (
          <div key={payment._id} className="flex flex-col gap-1">
            <div>
              <p>Amount: {payment.amount}</p>
              <p>Status: {payment.status}</p>
              <p>Attempts: {new Date(payment.createdAt).toLocaleString()}</p>
              <Button
                onClick={() => {
                  location.assign(
                    `/subscription/payment?orderId=${payment.order}`
                  );
                }}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistory;
