import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/providers/use-auth";
import { formatDateForComparison } from "@/utils/functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  userId: string;
  branchId: string;
  companyId: string;
  name: string;
}

interface DayStatus {
  color: string;
  status: string;
  attendanceId?: string;
}

const getMonthName = (year: number, month: number) =>
  new Date(year, month).toLocaleString("en-IN", { month: "long" });

export const AttendancePage: React.FC<AttendancePageProps> = ({
  userId,
  branchId,
  companyId,
  name,
}) => {
  const navigate = useNavigate();
  const today = React.useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [content, setContent] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attendance, setAttendance] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    halfDay: 0,
    paidLeave: 0,
    weekOff: 0,
  });

  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();

  const getDayStatus = React.useCallback(
    (day: number): DayStatus => {
      const currentDate = new Date(currentYear, selectedMonth, day);
      const dayOfWeek = currentDate.getDay();
      const formattedDate = formatDateForComparison(currentDate);
      if (
        selectedMonth === today.getMonth() &&
        currentDate.getDate() > today.getDate()
      ) {
        return { color: "bg-gray-300", status: "future" };
      }
      const info = content.find((item) => item.date === formattedDate);
      console.log("Formatted Date:", day, formattedDate, info);
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
            return { color: "bg-gray-500", status: "absent", attendanceId: "" };
        }
      }

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { color: "bg-gray-500", status: "week off" };
      }

      return { color: "bg-red-500", status: "absent" };
    },
    [currentYear, selectedMonth, today, content]
  );

  const fetchMonthAttendance = React.useCallback(
    (monthIndex: number) => {
      setLoading(true);
      const monthName = getMonthName(currentYear, monthIndex);
      axios
        .post("/api/attendance/month/information", {
          userId,
          branchId,
          companyId,
          month: monthName,
        })
        .then((res) => {
          console.log("Attendance data:", res.data);
          setContent(res.data.attendance);
        })
        .catch((err) => console.error("Error fetching attendance:", err))
        .finally(() => {
          setLoading(false);
        });
    },
    [userId, branchId, companyId, currentYear]
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

  const handleDayClick = (day: number) => {
    const { status, attendanceId } = getDayStatus(day);
    if (status === "future") return;

    const selectedDate = formatDateForComparison(
      new Date(currentYear, selectedMonth, day)
    );

    navigate("/editattendance", {
      state: {
        selectedDate,
        status,
        month: selectedMonth,
        id: {
          userId,
          branchId,
          companyId,
          attendanceId,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="px-4 py-8 md:mx-40 lg:mx-60">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 font-bold flex justify-between items-center rounded-t-lg">
        <div className="capitalize">{name}</div>
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
        {[
          {
            label: "Present",
            value: attendance.present,
            color: "bg-green-200",
            border: "border-green-500",
          },
          {
            label: "Absent",
            value: attendance.absent,
            color: "bg-red-200",
            border: "border-red-500",
          },
          {
            label: "Half day",
            value: attendance.halfDay,
            color: "bg-yellow-200",
            border: "border-yellow-500",
          },
          {
            label: "Paid Leave",
            value: attendance.paidLeave,
            color: "bg-purple-200",
            border: "border-purple-500",
          },
          {
            label: "Week Off",
            value: attendance.weekOff,
            color: "bg-gray-200",
            border: "border-gray-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-3 border-l-4 ${item.border} ${item.color} rounded-md`}
          >
            <p className="text-sm">{item.label}</p>
            <p className="font-bold">{item.value}</p>
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
          const { color, status } = getDayStatus(day);
          return (
            <Button
              key={day}
              className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
              title={status}
              onClick={() => handleDayClick(day)}
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
        })}
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNotesNavigate = (userId: string, name: string) => {
    navigate("/notespage", { state: { userId, name } });
  };

  if (!isAuthenticated || !user || !user.role) return null;

  const isEmployee = user.role.role === "employee";
  const attendanceProps = isEmployee
    ? {
        userId: user._id,
        companyId: user.role.company,
        branchId: user.role.branch,
        name: user.name,
      }
    : location.state;

  return (
    <div className="flex flex-col items-center mt-8">
      {!isEmployee && (
        <div className="flex rounded-lg shadow-lg overflow-hidden bg-white space-x-[1px]">
          <div className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold cursor-pointer">
            Attendance
          </div>
          <div
            onClick={() =>
              handleNotesNavigate(attendanceProps.userId, attendanceProps.name)
            }
            className="px-8 py-3 text-red-500 font-semibold cursor-pointer"
          >
            Notes
          </div>
        </div>
      )}
      <div className="mt-8 w-full rounded-xl overflow-hidden">
        <AttendancePage {...attendanceProps} />
      </div>
    </div>
  );
};

export default CalendarPage;
