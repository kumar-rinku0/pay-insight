"use client";

import axios from "axios";
import { useAuth } from "@/components/provider/auth-provider";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";

const GoogleCallback = () => {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");
  const error = params.get("error");
  const { signIn } = useAuth();

  const hasRun = useRef(false);

  useEffect(() => {
    if (!code || hasRun.current) return;
    if (error) {
      toast.error("Authentication failed.");
      router.push("/login");
      return;
    }
    hasRun.current = true;
    axios
      .post("/api/user/google/callback", { code })
      .then((response) => {
        const user = response.data.user;
        const name = `${user.givenName} ${user.familyName}`;
        signIn({ ...user, name });
        toast.success(`Hi ${user.givenName}, welcome to Sentinel.`);
        router.push("/dashboard");
      })
      .catch((err) => {
        const msg = err.response?.data?.msg || "Authentication failed.";
        toast.error(msg);
        router.push("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, error]);

  return (
    <div className="auth">
      <div className="h-[90vh] flex justify-center items-center">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

const GoogleCallbackLayout = () => {
  return (
    <Suspense
      fallback={
        <div className="auth">
          <div className="h-[90vh] flex justify-center items-center">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  );
};

export default GoogleCallbackLayout;
