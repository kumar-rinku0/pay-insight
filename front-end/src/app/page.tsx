"use client";

import Header from "@/components/partial/header";
import { useAuth } from "@/components/provider/auth-provider";
import Hero from "@/components/landing/hero";
import Tips from "@/components/landing/tips";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
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
