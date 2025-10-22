import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { type CalendarDrawerType } from "@/components/private/calendar/cal-drawer";
import axios from "axios";
import { useState } from "react";

const ATStatusChange = ({
  status,
  day,
  month,
  roleId,
  attendanceId,
  color,
}: CalendarDrawerType) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== "week off") {
      setCurrentStatus(newStatus);
    }
  };

  const handleUpdateStatus = () => {
    axios
      .patch("/api/attendance/update", {
        attendanceId: attendanceId.trim() ?? null,
        roleId: roleId,
        status: currentStatus,
        day: day,
        month: month,
      })
      .then((res) => {
        console.log(res);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-center items-center">
      <DrawerHeader>
        <DrawerTitle>
          Day: {day} Status: {currentStatus}
        </DrawerTitle>
        <DrawerDescription> </DrawerDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {["on time", "late", "half day", "absent", "holiday"].map((s) => (
            <Button
              key={s}
              variant="outline"
              className={`py-1 px-2 border uppercase border-gray-500 rounded-2xl ${
                currentStatus === s ? `bg-gray-500 ${color}` : "text-gray-500"
              }`}
              onClick={() => handleStatusChange(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </DrawerHeader>
      <DrawerFooter className="m-0 flex flex-col gap-4">
        <DrawerClose asChild>
          <Button className="w-full" variant="outline">
            Cancel
          </Button>
        </DrawerClose>
        <Button className="w-full" onClick={handleUpdateStatus}>
          Submit
        </Button>
      </DrawerFooter>
    </div>
  );
};

export default ATStatusChange;
