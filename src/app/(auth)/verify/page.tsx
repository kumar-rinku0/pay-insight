"use client";

import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams, redirect } from "next/navigation";
import React from "react";

const Varify = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("TOKEN");
  const auth = useAuth();
  if (!auth?.loading && auth?.isAuthenticated) {
    redirect("/");
  }
  const handleVarify = () => {
    axios
      .get(`/api/user/verify?TOKEN=${token}`)
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          const { username, _id, email } = res.data.user;
          auth?.signIn({ username, email, _id });
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center gap-4">
      <div>Varify Email</div>
      <Button onClick={handleVarify}>Varify!</Button>
    </div>
  );
};

export default Varify;
