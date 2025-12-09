import { type DayStatusWithRole } from "@/components/private/calendar/calendar";
import type {
  EmployeeAttendanceType,
  PunchingInfoType,
} from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";
import ATStatusChange from "../attendance/at-status-change";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ResponseType = {
  attendance: EmployeeAttendanceType;
  message: string;
};

const CalendarStatus = ({
  status,
  closeStatus,
  updateStatus,
}: {
  status: DayStatusWithRole;
  closeStatus: () => void;
  updateStatus: (newStatus: string, attendanceId: string | null) => void;
}) => {
  const [punchingInfo, setPunchingInfo] = useState<PunchingInfoType[] | null>(
    null
  );

  const [workHours, setWorkHours] = useState<number | null>(null);
  useEffect(() => {
    if (status.attendanceId) {
      axios
        .get<ResponseType>(
          `/api/attendance/attendancebyid/${status.attendanceId}`
        )
        .then((res) => {
          console.log(res);
          setPunchingInfo(res.data.attendance.punchingInfo);
          setWorkHours(res.data.attendance.workHours);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [status.attendanceId]);
  return (
    <div className="p-2 flex flex-col gap-4">
      <Button onClick={() => closeStatus()} className="self-start w-fit">
        <Undo2 />
      </Button>
      <ATStatusChange {...status} updateStatus={updateStatus} />
      <PunchingInformation
        punchingInfo={punchingInfo || []}
        workHours={workHours}
      />
    </div>
  );
};

const PunchingInformation = ({
  punchingInfo,
  workHours,
}: {
  punchingInfo: PunchingInfoType[];
  workHours: number | null;
}) => {
  return (
    <div>
      <div className="py-4">
        {/* work hours of any day */}
        {workHours === null ? (
          <span className="italic text-sm text-gray-500">
            No work hours recorded
          </span>
        ) : (
          <span className="font-semibold">Work Hours: {workHours} hrs</span>
        )}
      </div>
      <h3 className="font-semibold mb-2">Punching Info:</h3>
      {!punchingInfo && <div>No Punching Info Available</div>}
      {punchingInfo && punchingInfo.length === 0 && (
        <div>No Punching Info Available</div>
      )}
      {punchingInfo && punchingInfo.length > 0 && (
        <ul>
          {punchingInfo.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4"
            >
              {item.punchInInfo && (
                <div className="flex gap-1">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage
                      src={item.punchInInfo?.punchInImg}
                      alt={item.punchInInfo?.status}
                    />
                    <AvatarFallback className="rounded-lg bg-white">
                      IN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-start">
                      <span>IN : </span>
                      <span>
                        {new Date(
                          item.punchInInfo.createdAt
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="text-start text-sm text-slate-600">
                      {item.punchInInfo.punchInAddress}
                    </div>
                  </div>
                </div>
              )}
              {/* <hr className="my-2" /> */}
              {item.punchOutInfo && (
                <div className="flex gap-1">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage
                      src={item.punchOutInfo?.punchOutImg}
                      alt={item.punchOutInfo?.status}
                    />
                    <AvatarFallback className="rounded-lg bg-white">
                      OUT
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-start">
                      <span>OUT : </span>
                      <span>
                        {new Date(
                          item.punchOutInfo.createdAt
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="text-start text-sm text-slate-600">
                      {item.punchOutInfo.punchOutAddress}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarStatus;
