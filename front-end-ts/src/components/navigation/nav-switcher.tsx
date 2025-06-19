"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { CompanyRoleType } from "@/types/company";
import axios from "axios";

export function NavSwitcher({ company }: { company: CompanyRoleType | null }) {
  const { isMobile } = useSidebar();
  const [companies, setCompanies] = React.useState<CompanyRoleType[]>([]);

  const handleGetCompanies = React.useCallback(
    (userId: string) => {
      if (!userId || companies.length > 0) return;
      axios
        .get(`/api/role/userId/${userId}`)
        .then((res) => {
          const { roles } = res.data;
          setCompanies(roles);
        })
        .catch(console.error);
    },
    [companies.length]
  );

  const handleSelectOneCompany = (roleId: string) => {
    axios
      .get(`/api/company/select-rolebased-company/roleid/${roleId}`)
      .then((res) => {
        console.log(res);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!company) {
    return (
      <a
        className="font-medium text-neutral-500 dark:text-neutral-400"
        href="/company"
      >
        Create Company
      </a>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              handleGetCompanies(company.user);
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeCompany.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{company.name}</span>
                <span className="truncate text-xs">{company.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {companies.map((comp, index) => (
              <DropdownMenuItem
                key={comp.name}
                onSelect={() => handleSelectOneCompany(comp._id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {/* <comp.logo className="size-3.5 shrink-0" /> */}
                </div>
                {comp.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div
                className="text-muted-foreground font-medium"
                onClick={() => (location.href = "/company")}
              >
                Create Company
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
