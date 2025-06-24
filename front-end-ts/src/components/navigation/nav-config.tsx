"use client";

import {
  LayoutDashboard,
  Search,
  User,
  Users,
  AlertTriangle,
  Calendar,
  Building2,
  GitBranch,
  Settings,
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
          url: "/attendance",
          icon: AlertTriangle,
          isActive: isNavItemActive(pathname, `/attendance`),
        },
        {
          title: "Calendar",
          url: "/calendar",
          icon: Calendar,
          isActive: isNavItemActive(pathname, `/calendar`),
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
          isActive: isNavItemActive(pathname, `/profile`),
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/settings`),
        },
      ],
      adminNavigation: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: isNavItemActive(pathname, `/dashboard`),
        },
        {
          title: "Search",
          url: "/search",
          icon: Search,
          isActive: isNavItemActive(pathname, `/search`),
        },
        {
          title: "Companies",
          url: "/companies",
          icon: Building2,
          isActive: isNavItemActive(pathname, `/companies`),
          items: [
            {
              title: "Create Company",
              url: "/companies/create",
            },
          ],
        },
        {
          title: "Branches",
          url: "/branches",
          icon: GitBranch,
          isActive: isNavItemActive(pathname, `/branches`),
          items: [
            {
              title: "Create Branch",
              url: "/branches/create",
            },
            {
              title: "Create Staff",
              url: "/staff/create",
            },
          ],
        },
        {
          title: "Staff",
          url: "/staff",
          icon: Users,
          isActive: isNavItemActive(pathname, `/staff`),
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
          isActive: isNavItemActive(pathname, `/profile`),
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/settings`),
        },
      ],
      managerNavigation: [
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
          title: "Staff",
          url: "/staff",
          icon: Users,
          isActive: isNavItemActive(pathname, `/staff`),
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
          isActive: isNavItemActive(pathname, `/profile`),
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          isActive: isNavItemActive(pathname, `/settings`),
        },
      ],
    },
  };

  return data;
};
