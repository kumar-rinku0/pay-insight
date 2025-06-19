"use client";

import * as React from "react";

import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import { NavItems } from "./nav-config";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/use-auth";
import { NavSwitcher } from "./nav-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = NavItems();
  const { user, signOut } = useAuth();
  if (!user) {
    return null; // or a loading state, or redirect to login
  }
  data.user = { email: user.email, name: user.name, avatar: user?.picture };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher company={user.role || null} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} logoutHandler={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
