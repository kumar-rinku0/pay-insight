"use client";

import {
  LayoutDashboard,
  Sparkles,
  // Search,
  User,
  Users,
  AlertTriangle,
  Calendar,
  Building2,
  GitBranch,
  Settings,
  ScanFace,
  SwatchBook,
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
    navMain: {
      employeeNavigation: [
        {
          title: "Attandance",
          url: "/app/attendance",
          icon: ScanFace,
          isActive: isNavItemActive(pathname, `/app/attendance`),
        },
        {
          title: "Calendar",
          url: "/app/calendar",
          icon: Calendar,
          isActive: isNavItemActive(pathname, `/app/calendar`),
        },
        {
          title: "Shifts",
          url: "/app/shifts",
          icon: SwatchBook,
          isActive: isNavItemActive(pathname, `/app/shifts`),
        },
        {
          title: "Account",
          url: "/app/account",
          icon: User,
          isActive: isNavItemActive(pathname, `/app/account`),
        },
        {
          title: "Settings",
          url: "/app/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/app/settings`),
        },
      ],
      adminNavigation: [
        {
          title: "Dashboard",
          url: "/app/dashboard",
          icon: LayoutDashboard,
          isActive: isNavItemActive(pathname, `/app/dashboard`),
        },
        // {
        //   title: "Search",
        //   url: "/search",
        //   icon: Search,
        //   isActive: isNavItemActive(pathname, `/search`),
        // },
        {
          title: "Companies",
          url: "/app/companies",
          icon: Building2,
          isActive: isNavItemActive(pathname, `/app/companies`),
        },
        {
          title: "Branches",
          url: "/app/branches",
          icon: GitBranch,
          isActive: isNavItemActive(pathname, `/app/branches`),
        },
        {
          title: "Staff",
          url: "/app/staff",
          icon: Users,
          isActive: isNavItemActive(pathname, `/app/staff`),
        },
        {
          title: "Account",
          url: "/app/account",
          icon: User,
          isActive: isNavItemActive(pathname, `/app/account`),
        },
        {
          title: "Settings",
          url: "/app/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/app/settings`),
        },
        {
          title: "Subscription",
          url: "/app/subscription",
          icon: Sparkles,
          isActive: isNavItemActive(pathname, `/app/subscription`),
        },
      ],
      managerNavigation: [
        {
          title: "Dashboard",
          url: "/app/dashboard",
          icon: LayoutDashboard,
          isActive: isNavItemActive(pathname, `/app/dashboard`),
        },
        {
          title: "Attandance",
          url: "/app/attendance",
          icon: AlertTriangle,
          isActive: isNavItemActive(pathname, `/app/attendance`),
        },
        // {
        //   title: "Search",
        //   url: "/search",
        //   icon: Search,
        //   isActive: isNavItemActive(pathname, `/search`),
        // },
        {
          title: "Calendar",
          url: "/app/calendar",
          icon: Calendar,
          isActive: isNavItemActive(pathname, `/app/calendar`),
        },
        {
          title: "Staff",
          url: "/app/staff",
          icon: Users,
          isActive: isNavItemActive(pathname, `/app/staff`),
        },
        {
          title: "Account",
          url: "/app/account",
          icon: User,
          isActive: isNavItemActive(pathname, `/app/account`),
        },
        {
          title: "Settings",
          url: "/app/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/app/settings`),
        },
        {
          title: "Subscription",
          url: "/app/subscription",
          icon: Sparkles,
          isActive: isNavItemActive(pathname, `/app/subscription`),
        },
      ],
    },
  };

  return data;
};
