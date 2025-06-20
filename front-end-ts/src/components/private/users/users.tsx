import { useAuth } from "@/providers/use-auth";
import axios from "axios";
import { useEffect, useState } from "react";
import type { RoleUserType } from "@/types/res-type";

type ResponseType = {
  roles: RoleUserType[];
  message: string;
};

const Users = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<RoleUserType[]>([]);
  const handleFetchUsers = (companyId: string) => {
    axios
      .get<ResponseType>(`/api/role/employee/companyId/${companyId}`)
      .then((res) => {
        console.log(res.data);
        setRoles(res.data.roles);
      });
  };
  useEffect(() => {
    if (user) {
      handleFetchUsers(user.role.company);
    }
  }, [user]);
  return (
    <div>
      {roles.length === 0 ? (
        <div>NO Users</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
