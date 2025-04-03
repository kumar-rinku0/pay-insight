"use client";

import Attendance from "@/components/pages/attendance";
import CreateBranch from "@/components/pages/create-branch";
import CreateCompany from "@/components/pages/create-company";
import CreateStaff from "@/components/pages/create-staff";
import { useRoute } from "@/components/provider/route-provider";
import React from "react";
// import { useAuth } from "@/components/provider/auth-provider";

const Dashboard = () => {
  // const { user } = useAuth();
  const { route } = useRoute();
  return (
    <div>
      {route.company && <CreateCompany />}
      {route.branch && <CreateBranch />}
      {route.staff && <CreateStaff />}
      {route.dashboard && <Attendance />}
      {route.attendance && <Skeleton />}
    </div>
  );
};

const Skeleton = () => {
  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
          <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
          <div className="aspect-video rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-neutral-100/50 md:min-h-min dark:bg-neutral-800/50" />
      </div>
    </div>
  );
};

export default Dashboard;
