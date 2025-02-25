"use client";

import { useAuth } from "@/components/provider/auth-provider";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const auth = useAuth();
  console.log(auth);
  if (!auth?.loading && !auth?.isAuthenticated) {
    redirect("/login");
  }
  return (
    <div>
      <div>Dashboard!</div>
    </div>
  );
};

export default Dashboard;
