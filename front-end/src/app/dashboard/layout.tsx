"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useAuth } from "@/components/provider/auth-provider";
import { RouteProvider } from "@/components/provider/route-provider";
import BreadCrumb from "@/components/partial/bread-curmb";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();
  // if (!loading && !isAuthenticated) {
  //   redirect("/login");
  // }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      redirect("/login");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  // setContent((prev) => ({ ...prev, company: auth?.user?.company }));
  return (
    <SidebarProvider>
      <RouteProvider>
        <AppSidebar />
        <SidebarInset className="h-[100vh] flex-1 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadCrumb />
            </div>
          </header>
          {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
            <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
            <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-neutral-100/50 md:min-h-min dark:bg-neutral-800/50" />
        </div> */}
          <div>{children}</div>
        </SidebarInset>
      </RouteProvider>
    </SidebarProvider>
  );
}
