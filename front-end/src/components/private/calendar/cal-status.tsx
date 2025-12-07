import { type DayStatusWithMonth } from "@/components/private/calendar/calendar";
import type {
  EmployeeAttendanceType,
  PunchingInfoType,
} from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";

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

const CalendarStatus = ({
  status,
  closeStatus,
}: {
  status: DayStatusWithMonth;
  closeStatus: () => void;
}) => {
  const [punchingInfo, setPunchingInfo] = useState<PunchingInfoType[] | null>(
    null
  );
  useEffect(() => {
    if (status.attendanceId) {
      axios
        .get<ResponseType>(
          `/api/attendance/attendancebyid/${status.attendanceId}`
        )
        .then((res) => {
          console.log(res);
          setPunchingInfo(res.data.attendance.punchingInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [status.attendanceId]);
  return (
    <div>
      <div>
        <button onClick={() => closeStatus()}>close</button>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
      <div>
        <pre>{JSON.stringify(punchingInfo, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CalendarStatus;
