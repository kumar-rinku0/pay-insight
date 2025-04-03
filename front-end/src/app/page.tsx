"use client";

import Header from "@/components/partial/header";
import { useAuth } from "@/components/provider/auth-provider";
import { Loader } from "lucide-react";
import Hero from "@/components/landing/hero";
import Tips from "@/components/landing/tips";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <Loader className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="app">
      <Header root={true} />
      <div className="h-full sm:h-[60vh]">
        <Hero
          btn={isAuthenticated ? "Dashboard" : "Get Started"}
          btnRef={isAuthenticated ? "/dashboard" : "/register"}
        />
      </div>
      <Tips />
      <h1>Welcome to my front-end application</h1>
    </div>
  );
}
