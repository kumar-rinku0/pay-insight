import axios from "axios";
import { useEffect, useState } from "react";
import type { RoleUserType } from "@/types/res-type";
import { useNavigate } from "react-router";
import { Calendar } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { AttendancePage } from "../calendar/calendar";

type ResponseType = {
  roles: RoleUserType[];
  message: string;
};

const Staff = () => {
  const router = useNavigate();
  const [roles, setRoles] = useState<RoleUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const handleFetchUsers = () => {
    setLoading(true);
    axios.get<ResponseType>(`/api/role/employees`).then((res) => {
      console.log(res.data);
      setRoles(res.data.roles);
      setLoading(false);
    });
  };
  useEffect(() => {
    handleFetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div>
      {roles.length === 0 ? (
        <div>NO Employees</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="hidden lg:flex px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Info
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {role.user.name}
                </td>
                <td className="hidden lg:flex px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.role}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  onClick={() => router(`/users/calendar?roleId=${role._id}`)}
                >
                  <Calendar className="inline-block mr-2 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Staff;
