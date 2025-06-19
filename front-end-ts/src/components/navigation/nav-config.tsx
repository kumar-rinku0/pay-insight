"use client";

import {
  LayoutDashboard,
  Search,
  Pill,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { useLocation } from "react-router";

// This is sample data.

export const NavItems = () => {
  const { pathname } = useLocation();
  function isNavItemActive(pathname: string, path: string) {
    return pathname === path;
  }

  const data = {
    teams: [
      {
        name: "Dummy",
        logo: LayoutDashboard,
        plan: "Free",
      },
    ],
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: isNavItemActive(pathname, `/dashboard`),
      },
      {
        title: "Search",
        url: "/dashboard/search",
        icon: Search,
        isActive: isNavItemActive(pathname, `/dashboard/search`),
      },
      {
        title: "Pharmacy Manager",
        url: "/dashboard/create-pharmacy",
        icon: Pill,
        isActive: isNavItemActive(pathname, `/dashboard/create-pharmacy`),
        items: [
          {
            title: "Create Pharmacy",
            url: "/dashboard/create-pharmacy",
          },
          {
            title: "Pharmacies",
            url: "/dashboard/list-pharmacy",
          },
        ],
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        isActive: isNavItemActive(pathname, `/dashboard/users`),
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
        isActive: isNavItemActive(pathname, `/dashboard/profile`),
      },
      {
        title: "Logout",
        url: "/logout",
        icon: LogOut,
        isActive: isNavItemActive(pathname, `/logout`),
      },
    ],
  };

  return data;
};
