import type { EmployeeAttendanceType } from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ResponseType = {
  attendances: EmployeeAttendanceType[];
  message: string;
  punchInCount: number;
};

const PunchInEmployees = () => {
  const [employeesAttendance, setEmployeesAttendance] = useState<
    EmployeeAttendanceType[] | null
  >(null);

  const handleGetEmployeesAttendance = () => {
    axios
      .get<ResponseType>("/api/attendance/employees")
      .then((res) => {
        console.log(res);
        setEmployeesAttendance(res.data.attendances);
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
        setEmployeesAttendance([]);
      });
  };
  useEffect(() => {
    handleGetEmployeesAttendance();
  }, []);
  if (!employeesAttendance) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (employeesAttendance.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        NO Employees IN
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center">
      <table className="table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:flex">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              in time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employeesAttendance.map((empoyeeAttendance) => (
            <tr key={empoyeeAttendance._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {empoyeeAttendance.role.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:flex">
                {empoyeeAttendance.role.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {empoyeeAttendance.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {empoyeeAttendance?.punchingInfo[0]?.punchInInfo?.createdAt
                  ? new Date(
                      empoyeeAttendance.punchingInfo[0].punchInInfo.createdAt
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PunchInEmployees;
