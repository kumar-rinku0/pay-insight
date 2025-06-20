"use client";

import {
  LayoutDashboard,
  Search,
  Pill,
  User,
  Users,
  AlertTriangle,
  Calendar,
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
      _id: "12345",
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
        title: "Attandance",
        url: "/attendance",
        icon: AlertTriangle,
        isActive: isNavItemActive(pathname, `/attendance`),
      },
      {
        title: "Search",
        url: "/search",
        icon: Search,
        isActive: isNavItemActive(pathname, `/search`),
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
        isActive: isNavItemActive(pathname, `/calendar`),
      },
      {
        title: "Company Manager",
        url: "/company",
        icon: Pill,
        isActive: isNavItemActive(pathname, `/company`),
        items: [
          {
            title: "Create Company",
            url: "/company",
          },
          {
            title: "Create Branch",
            url: "/branch",
          },
          {
            title: "Create staff",
            url: "/staff",
          },
        ],
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
        isActive: isNavItemActive(pathname, `/users`),
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
        isActive: isNavItemActive(pathname, `/profile`),
      },
    ],
  };

  return data;
};
