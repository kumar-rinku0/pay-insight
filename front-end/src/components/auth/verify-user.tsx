"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router";
import { Suspense } from "react";
import { toast } from "sonner";

const Verify = () => {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("TOKEN");
  const handleVarify = () => {
    axios
      .get(`/api/user/verify?TOKEN=${token}`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const { email } = res.data.user;
          toast.success(`${email} has been verified!`);
          router("/login");
        }
      })
      .catch((err) => {
        console.log(err.status);
        toast.error(err.response.data.error);
      });
  };
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center gap-4">
      <div>Varify Email</div>
      <Button onClick={handleVarify}>Varify!</Button>
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
};

export default VerifyPage;
