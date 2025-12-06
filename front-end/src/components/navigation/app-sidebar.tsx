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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/use-auth";
import { NavSwitcher } from "./nav-switcher";
import { ChevronLeft } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = NavItems();
  const { employeeNavigation, adminNavigation, managerNavigation } =
    data.navMain;
  const { user, signOut } = useAuth();
  if (!user) {
    return null; // or a loading state, or redirect to login
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher company={user.role || null} />
      </SidebarHeader>

      <SidebarContent>
        {user.role ? (
          <NavMain
            items={
              user.role.role === "admin"
                ? adminNavigation
                : user.role.role === "manager"
                ? managerNavigation
                : employeeNavigation
            }
          />
        ) : (
          <p className="hidden text-center text-sm text-neutral-500 dark:text-neutral-400">
            Please select or create a company to view the navigation.
          </p>
        )}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logoutHandler={signOut} />
      </SidebarFooter>
      <SidebarRail>
        <SidebarTrigger
          className=" absolute bottom-1/4 left-1/2 -translate-x-1/2 flex items-center justify-center h-9 w-9 rounded-full shadow-md bg-muted text-foreground hover:bg-muted/70 active:bg-muted/60 border border-border transition-all duration-200"
          icon={ChevronLeft}
        />
      </SidebarRail>
    </Sidebar>
  );
}
