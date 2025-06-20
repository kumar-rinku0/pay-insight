"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

// import types
import type { UserRoleType } from "@/types/auth";
import { AuthContext } from "./use-auth";

// Create the Context with default value as null

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserRoleType | null>(null);

  const signIn = (userInfo: UserRoleType) => {
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    }
  };

  const signOut = () => {
    axios
      .get("/api/user/logout")
      .then(() => {
        router("/");
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => console.log("Logout error: ", err)); // Improved error handling
  };

  // Check authentication status on initial render
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
      return;
    } else {
      axios
        .get("/api")
        .then((res) => {
          console.log(res.data.user);
          if (res.data.user) {
            signIn(res.data.user);
          }
        })
        .catch((err) => {
          console.error("Authentication check failed: ", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
