import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import DayButton from "./day-button";

import ATStatusChange from "../attendance/at-status-change";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type {
  EmployeeAttendanceType,
  PunchingInfoType,
} from "@/types/res-type";
import axios from "axios";

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
        <ATStatusChange
          attendanceId={attendanceId}
          color={color}
          day={day}
          month={month}
          roleId={roleId}
          status={status}
        />
        {!punchingInfo && (
          <Button variant={"link"} onClick={handleViewInfoClick}>
            View Info
          </Button>
        )}

        {punchingInfo && (
          <div className="flex flex-wrap gap-1 p-2">
            {punchingInfo.map((item) => (
              <div className="bg-accent p-2 rounded-md">
                <div>
                  <span>in : </span>
                  <span>
                    {new Date(item.punchInInfo.createdAt).toLocaleTimeString(
                      "en-US"
                    )}
                  </span>
                </div>
                <div>
                  <span>out : </span>
                  <span>
                    {item.punchOutInfo
                      ? new Date(item.punchInInfo.createdAt).toLocaleTimeString(
                          "en-US"
                        )
                      : "-------"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDrawer;
