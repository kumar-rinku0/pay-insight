import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "@/providers/use-auth";
import { formatDateForComparison } from "@/utils/functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserType } from "@/types/auth";
// import { Button } from "@/components/ui/button";
import CalendarStatus from "./cal-status";
import CalendarDayButton from "@/components/private/calendar/cal-daybtn";

type ResponseType = {
  message: string;
  attendances: AttendanceData[];
  weekOffs: string[];
  user: UserType;
};

interface AttendanceData {
  _id: string;
  date: string;
  status: "on time" | "late" | "half day" | "holiday" | "absent";
}

interface AttendanceSummary {
  present: number;
  absent: number;
  halfDay: number;
  paidLeave: number;
  weekOff: number;
}

interface AttendancePageProps {
  roleId: string;
}

interface DayStatus {
  color: string;
  status: string;
  attendanceId: string | null;
}

export interface DayStatusWithRole extends DayStatus {
  day: number;
  selectedMonth: number;
  roleId: string;
}

interface AttendanceStat {
  id: keyof AttendanceSummary;
  label: string;
  color: string;
  border: string;
}

const attendanceStats = [
  {
    id: "present",
    label: "Present",
    color: "bg-green-200",
    border: "border-green-500",
  },
  {
    id: "absent",
    label: "Absent",
    color: "bg-red-200",
    border: "border-red-500",
  },
  {
    id: "halfDay",
    label: "Half day",
    color: "bg-yellow-200",
    border: "border-yellow-500",
  },
  {
    id: "paidLeave",
    label: "Paid Leave",
    color: "bg-purple-200",
    border: "border-purple-500",
  },
  {
    id: "weekOff",
    label: "Week Off",
    color: "bg-gray-200",
    border: "border-gray-500",
  },
] as AttendanceStat[];

const getMonthName = (year: number, month: number) =>
  new Date(year, month).toLocaleString("en-IN", { month: "long" });

export const AttendancePage: React.FC<AttendancePageProps> = ({ roleId }) => {
  const today = React.useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [content, setContent] = useState<AttendanceData[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [weekOffs, setWeekOffs] = useState<string[]>([]); // Assuming week offs are stored in the user object
  const [loading, setLoading] = useState<boolean>(true);
  const [attendance, setAttendance] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    halfDay: 0,
    paidLeave: 0,
    weekOff: 0,
  });
  const [status, setStatus] = useState<DayStatusWithRole | null>(null);

  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();

  const getDayStatus = React.useCallback(
    (day: number): DayStatus => {
      const currentDate = new Date(currentYear, selectedMonth, day);
      const shortDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const dayOfWeek = shortDays[currentDate.getDay()];
      const formattedDate = formatDateForComparison(currentDate);
      if (
        selectedMonth === today.getMonth() &&
        currentDate.getDate() > today.getDate()
      ) {
        return { color: "bg-gray-300", status: "future", attendanceId: null };
      }
      const info = content.find((item) => item.date === formattedDate);
      if (info) {
        switch (info.status) {
          case "on time":
          case "late":
            return {
              color: "bg-green-500",
              status: info.status,
              attendanceId: info._id,
            };
          case "half day":
            return {
              color: "bg-yellow-500",
              status: "half day",
              attendanceId: info._id,
            };
          case "holiday":
            return {
              color: "bg-gray-500",
              status: "holiday",
              attendanceId: info._id,
            };
          case "absent":
            return {
              color: "bg-red-500",
              status: "absent",
              attendanceId: info._id,
            };
          default:
            return {
              color: "bg-gray-500",
              status: "absent",
              attendanceId: null,
            };
        }
      }

      if (weekOffs.includes(dayOfWeek)) {
        return { color: "bg-gray-500", status: "week off", attendanceId: null };
      }

      return { color: "bg-red-500", status: "absent", attendanceId: null };
    },
    [currentYear, selectedMonth, today, content, weekOffs]
  );

  const fetchMonthAttendance = React.useCallback(
    (monthIndex: number) => {
      setLoading(true);
      const monthName = getMonthName(currentYear, monthIndex);
      axios
        .post<ResponseType>("/api/attendance/month/information", {
          roleId,
          month: monthName,
        })
        .then((res) => {
          console.log("Attendance data:", res.data);
          setUser(res.data.user);
          setWeekOffs(res.data.weekOffs);
          setContent(res.data.attendances);
        })
        .catch((err) => console.error("Error fetching attendance:", err))
        .finally(() => {
          setLoading(false);
        });
    },
    [roleId, currentYear]
  );

  useEffect(() => {
    fetchMonthAttendance(selectedMonth);
  }, [selectedMonth, fetchMonthAttendance]);

  useEffect(() => {
    let present = 0,
      absent = 0,
      halfDay = 0,
      weekOff = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const { status } = getDayStatus(day);
      if (status === "on time" || status === "late") present++;
      else if (status === "half day") halfDay++;
      else if (status === "absent") absent++;
      else if (status === "week off") weekOff++;
    }

    setAttendance({ present, absent, halfDay, paidLeave: 0, weekOff });
  }, [content, selectedMonth, daysInMonth, currentYear, getDayStatus]);

  const handleDayClick = ({
    color,
    day,
    status,
    attendanceId,
    selectedMonth,
    roleId,
  }: DayStatusWithRole) => {
    if (status === "future") return;

    setStatus({ color, day, status, attendanceId, selectedMonth, roleId });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status) {
    return (
      <CalendarStatus
        status={status}
        closeStatus={() => {
          setStatus(null);
        }}
        updateStatus={(newStatus: string, attendanceId: string | null) => {
          setContent((prev) => {
            const date = formatDateForComparison(
              new Date(currentYear, status.selectedMonth, status.day)
            );
            const existingIndex = prev.findIndex((item) => item.date === date);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                status: newStatus as AttendanceData["status"],
              };
              return updated;
            } else {
              return [
                ...prev,
                {
                  _id: attendanceId || Date.now().toString(), // New entries might not have an ID yet
                  date,
                  status: newStatus as AttendanceData["status"],
                },
              ];
            }
          });
        }}
      />
    );
  }

  return (
    <div className="px-4 py-8 min-h-[60vh]">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 font-bold flex justify-between items-center rounded-t-lg">
        <div className="capitalize">{user?.name}</div>
        <Select
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
          defaultValue={`${selectedMonth}`}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...Array(3)].map((_, i) => {
              const monthIndex = today.getMonth() - i;
              if (monthIndex < 0) return null;
              return (
                <SelectItem key={i} value={`${monthIndex}`}>
                  {getMonthName(currentYear, monthIndex)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4 text-center">
        {attendanceStats.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 border-l-4 ${item.border} ${item.color} rounded-md`}
          >
            <p className="text-sm">{item.label}</p>
            <p className="font-bold">{attendance[item.id]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mt-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx} className="font-medium text-gray-600">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`empty-${idx}`} className="p-3" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const { color, status, attendanceId } = getDayStatus(day);
          return (
            <CalendarDayButton
              key={i}
              color={color}
              day={day}
              status={status}
              onClick={() => {
                handleDayClick({
                  color,
                  day,
                  status,
                  attendanceId,
                  selectedMonth,
                  roleId,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const EmployeeCalendar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role.role === "admin";

  if (isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="mt-8 w-full rounded-xl overflow-hidden">
        <AttendancePage roleId={user.role._id} />
      </div>
    </div>
  );
};

export const AdminCalendar = () => {
  const [searchParmas] = useSearchParams();
  const roleId = searchParmas.get("roleId");
  if (!roleId) {
    return null;
  }
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="mt-8 w-full rounded-xl overflow-hidden">
        <AttendancePage roleId={roleId} />
      </div>
    </div>
  );
};

export default EmployeeCalendar;

// calendar day button

// <Button
//   key={day}
//   className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
//   title={status}
//   onClick={() =>
//     handleDayClick({
//       color,
//       day,
//       status,
//       attendanceId,
//       selectedMonth,
//     })
//   }
// >
//   <span className="absolute top-1 left-0 right-0 text-[0.8rem]">
//     {day}
//   </span>
//   <span
//     className={`absolute bottom-1 left-0 right-0 text-[0.6rem] ${
//       ["late", "half day"].includes(status) ? "" : "opacity-0"
//     }`}
//   >
//     {status}
//   </span>
// </Button>
