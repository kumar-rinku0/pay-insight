// import { useParams, useSearchParams } from "react-router";
// const UpdateAttendance = () => {
//   const { day } = useParams<{ day: string }>();
//   const [searchParmas] = useSearchParams();
//   const attendanceId = searchParmas.get("attendanceId");
//   const month = searchParmas.get("month");
//   console.log(attendanceId, day, month);
//   if (!attendanceId) {
//     return null;
//   }
//   return <div>UpdateAttendance</div>;
// };

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const UpdateAttendance = ({
  day,
  color,
  status,
  attendanceId,
  roleId,
  month,
}: {
  day: number;
  color: string;
  status: string;
  attendanceId: string;
  roleId: string;
  month: number;
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  if (status === "future") {
    return (
      <Button
        onClick={(e) => {
          e.currentTarget.blur();
        }}
        key={day}
        className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
        title={status}
        // onClick={() => handleDayClick(day)}
      >
        <span className="absolute top-1 left-0 right-0 text-[0.8rem]">
          {day}
        </span>
        <span
          className={`absolute bottom-1 left-0 right-0 text-[0.6rem] ${
            ["late", "half day"].includes(status) ? "" : "opacity-0"
          }`}
        >
          {status}
        </span>
      </Button>
    );
  }
  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== "week off") {
      setCurrentStatus(newStatus);
    }
  };

  const handleUpdateStatus = async () => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={(e) => {
            e.currentTarget.blur();
          }}
          key={day}
          className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
          title={status}
        >
          <span className="absolute top-1 left-0 right-0 text-[0.8rem]">
            {day}
          </span>
          <span
            className={`absolute bottom-1 left-0 right-0 text-[0.6rem] ${
              ["late", "half day"].includes(status) ? "" : "opacity-0"
            }`}
          >
            {status}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Day: {day} Status: {currentStatus}
          </DrawerTitle>
          <DrawerDescription>Are you wanna change status?</DrawerDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {["on time", "late", "half day", "absent", "holiday"].map((s) => (
              <Button
                key={s}
                variant="outline"
                className={`py-1 px-2 border uppercase border-gray-500 rounded-2xl ${
                  currentStatus === s
                    ? "bg-gray-500 text-green-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleStatusChange(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex justify-between gap-2">
            <DrawerClose asChild>
              <Button className="w-1/2" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              className="w-1/2"
              onClick={() => {
                handleUpdateStatus();
                location.reload();
              }}
            >
              Submit
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default UpdateAttendance;
