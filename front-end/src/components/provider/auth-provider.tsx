"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define the types for the user and the AuthContext
type userInfoType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  role?: {
    _id: string;
    name: string;
    company: string;
    role: string;
    branch?: string;
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: userInfoType | null;
  signIn: (userInfo: userInfoType) => void;
  signOut: () => void;
  loading: boolean;
};

// Create the Context with default value as null
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<userInfoType | null>(null);

  const signIn = (userInfo: userInfoType) => {
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    }
  };

  const signOut = () => {
    axios
      .get("/api/user/logout")
      .then(() => {
        router.push("/");
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => console.log("Logout error: ", err)); // Improved error handling
  };

  // Check authentication status on initial render
  useEffect(() => {
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
        setLoading(false); // Ensure loading state is turned off on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
