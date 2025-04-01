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

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { useAuth } from "./provider/auth-provider";
import { Button } from "./ui/button";
import axios from "axios";
import { useRoute } from "./provider/route-provider";

const logo = {
  admin: <GalleryVerticalEnd className="size-4 shrink-0" />,
  employee: <Command className="size-4 shrink-0" />,
  manager: <AudioWaveform className="size-4 shrink-0" />,
};

type companiesType = {
  _id: string;
  role: keyof typeof logo;
  company: { _id: string; name: string };
};

export function TeamSwitcher() {
  //   {
  //   teams,
  // }: {
  //   teams: {
  //     name: string;
  //     logo: React.ElementType;
  //     plan: string;
  //   }[];
  // }
  const { user, signIn } = useAuth();
  const { resetRoute } = useRoute();
  const { isMobile } = useSidebar();
  const [companies, setCompanies] = React.useState<companiesType[]>([]);

  const handleGetCompanies = React.useCallback(
    (userId: string) => {
      if (companies.length === 0) {
        axios
          .get(`/api/user/userId/${userId}`)
          .then((res) => {
            console.log(res);
            const { roleInfo } = res.data.user;
            setCompanies(roleInfo);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [companies]
  );

  const handleSelectOneCompany = React.useCallback(
    (companyId: string) => {
      if (companyId && user) {
        axios
          .get(`/api/company/select?companyId=${companyId}`)
          .then((res) => {
            console.log(res);
            const { company } = res.data;
            signIn({ ...user, company: company });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [user, signIn]
  );
  if (!user?.company?.name) {
    return (
      <Button
        className="font-medium text-neutral-500 dark:text-neutral-400"
        onClick={() => resetRoute("company")}
      >
        Create Company
      </Button>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onMouseEnter={() => handleGetCompanies(user._id)}
              onFocus={() => handleGetCompanies(user._id)}
              // onPointerEnter={() => handleGetCompanies(user._id)}
              // onSelect={() => handleGetCompanies(user._id)}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.company?.name}
                </span>
                <span className="truncate text-xs">{user.company.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-400">
              Companies
            </DropdownMenuLabel>
            {companies &&
              companies.map((info: companiesType) => (
                <DropdownMenuItem
                  key={info._id}
                  onSelect={() => handleSelectOneCompany(info.company._id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {logo[info.role]}
                  </div>
                  {info.company.name}
                  <DropdownMenuShortcut>{info.role}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => resetRoute("company")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-neutral-500 dark:text-neutral-400">
                Create Company
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
