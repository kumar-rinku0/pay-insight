import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DayButton from "./day-button";

import ATStatusChange from "../attendance/at-status-change";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type {
  EmployeeAttendanceType,
  PunchingInfoType,
} from "@/types/res-type";
import axios from "axios";
import { useAuth } from "@/providers/use-auth";

export type CalendarDrawerType = {
  day: number;
  color: string;
  status: string;
  attendanceId: string;
  roleId: string;
  month: number;
};

type ResponseType = {
  attendance: EmployeeAttendanceType;
  message: string;
};

const CalendarDrawer = ({
  day,
  color,
  status,
  attendanceId,
  roleId,
  month,
}: CalendarDrawerType) => {
  const { user } = useAuth();
  const [punchingInfo, setPunchingInfo] = useState<PunchingInfoType[] | null>(
    null
  );
  const handleViewInfoClick = () => {
    axios
      .get<ResponseType>(`/api/attendance/attendancebyid/${attendanceId}`)
      .then((res) => {
        console.log(res);
        setPunchingInfo(res.data.attendance.punchingInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (!user) {
    return null;
  }
  if (status === "future") {
    return <DayButton day={day} color={color} status={status} />;
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DayButton
          day={day}
          color={color}
          status={status}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.blur();
          }}
        />
      </DrawerTrigger>
      <DrawerContent>
        {user.role.role === "admin" && (
          <ATStatusChange
            attendanceId={attendanceId}
            color={color}
            day={day}
            month={month}
            roleId={roleId}
            status={status}
          />
        )}
        {!punchingInfo && (
          <DrawerHeader>
            <DrawerTitle>Punching Information!!</DrawerTitle>
            <DrawerDescription> </DrawerDescription>
            <Button variant={"link"} onClick={handleViewInfoClick}>
              View Info
            </Button>
          </DrawerHeader>
        )}

        {punchingInfo && (
          <>
            <DrawerHeader>
              <DrawerTitle>Punching Information!!</DrawerTitle>
              <DrawerDescription> </DrawerDescription>
            </DrawerHeader>
            <div className="flex justify-center items-center flex-wrap gap-1 p-2">
              {punchingInfo.map((item, idx) => (
                <DrawerHeader className="bg-accent p-2 rounded-md" key={idx}>
                  <DrawerDescription>
                    <span>IN&#42; : </span>
                    <span>
                      {new Date(item.punchInInfo.createdAt).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "numeric" }
                      )}
                    </span>
                  </DrawerDescription>

                  <DrawerDescription>
                    <span>OUT : </span>
                    <span>
                      {item.punchOutInfo
                        ? new Date(
                            item.punchInInfo.createdAt
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })
                        : "--:--"}
                    </span>
                  </DrawerDescription>
                </DrawerHeader>
              ))}
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDrawer;
