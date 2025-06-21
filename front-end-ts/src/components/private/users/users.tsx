import axios from "axios";
import { useEffect, useState } from "react";
import type { RoleUserType } from "@/types/res-type";
import { useNavigate } from "react-router";

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

const Users = () => {
  const router = useNavigate();
  const [roles, setRoles] = useState<RoleUserType[]>([]);
  const handleFetchUsers = () => {
    axios.get<ResponseType>(`/api/role/employees`).then((res) => {
      console.log(res.data);
      setRoles(res.data.roles);
    });
  };
  useEffect(() => {
    handleFetchUsers();
  }, []);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.role}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  onClick={() => router(`/users/calendar?roleId=${role._id}`)}
                >
                  {/* <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                        <AttendancePage
                          userId={role.user._id}
                          branchId={role.branch || ""}
                          companyId={role.company}
                          name={role.user.name}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                  calender
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
