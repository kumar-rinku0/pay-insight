import { Button } from "@/components/ui/button";
import {
  getMonthName,
  type DayStatusWithRole,
} from "@/components/private/calendar/calendar";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/use-auth";

const ATStatusChange = ({
  status,
  day,
  selectedMonth,
  attendanceId,
  roleId,
  updateStatus,
}: DayStatusWithRole & {
  updateStatus: (newStatus: string, attendanceId: string | null) => void;
}) => {
  const { user } = useAuth();
  const [currentAttendanceId, setCurrentAttendanceId] = useState<string | null>(
    attendanceId
  );
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: string) => {
    if (user?.role.role !== "employee") {
      handleUpdateStatus(newStatus);
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
    setLoading(true);
    axios
      .patch("/api/attendance/update", {
        attendanceId: currentAttendanceId,
        roleId: roleId,
        status: newStatus,
        day: day,
        month: selectedMonth,
      })
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        setCurrentStatus(newStatus);
        setCurrentAttendanceId(res.data.attendance._id);
        updateStatus(newStatus, res.data.attendance._id);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <h2 className="text-lg font-semibold">{`${day} ${getMonthName(
        new Date().getFullYear(),
        selectedMonth
      )}`}</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {["on time", "late", "half day", "absent", "holiday"].map((s) => (
          <Button
            key={s}
            variant="outline"
            className={`py-1 px-2 border uppercase border-slate-300 rounded-2xl ${
              currentStatus === s ? "bg-slate-300" : "text-slate-900"
            }`}
            disabled={currentStatus === s || loading}
            onClick={() => handleStatusChange(s)}
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ATStatusChange;
