"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// Define the types for the user and the AuthContext
type routeType = {
  dashboard: boolean;
  company: boolean;
  branch: boolean;
  staff: boolean;
};

type RouteContextType = {
  route: routeType;
  activeRoute: string;
  resetRoute: (route: string) => void;
};

// Create the Context with default value as null
const RouteContext = createContext<RouteContextType | null>(null);

// Create a provider component
export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  // const [Exist, setContentExist] = useState(false);
  const [route, setRoute] = useState<routeType>({
    dashboard: false,
    company: false,
    branch: false,
    staff: false,
  });
  const [activeRoute, setActiveRoute] = useState<string>("dashboard");

  const resetRoute = (newRoute: string) => {
    if (newRoute !== activeRoute) {
      setRoute((prev) => ({ ...prev, [newRoute]: true, [activeRoute]: false }));
      setActiveRoute(newRoute);
      // setRoute((prev) => ({ ...prev, ...route }));
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname.split("/").pop();
    if (currentPath) {
      setActiveRoute(currentPath);
      setRoute((prev) => ({ ...prev, [currentPath]: true }));
    }
  }, []);

  return (
    <RouteContext.Provider value={{ route, activeRoute, resetRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

// Custom hook to use the auth context
export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within an RouteProvider");
  }
  return context;
};
