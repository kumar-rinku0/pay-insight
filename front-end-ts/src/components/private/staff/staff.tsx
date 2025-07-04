import axios from "axios";
import { useEffect, useState } from "react";
import type { RoleUserType } from "@/types/res-type";
import { useNavigate, useSearchParams } from "react-router";
import { Calendar, ClockArrowUp, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResponseType = {
  roles: RoleUserType[];
  totalPage: number;
  message: string;
};

type RolesContentType = {
  roles: RoleUserType[];
  totalPage: number;
};

const Staff = ({ page }: { page: number }) => {
  const router = useNavigate();
  const [content, setContent] = useState<RolesContentType>({
    roles: [],
    totalPage: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const handleFetchUsers = (pageNo: number) => {
    setLoading(true);
    axios
      .get<ResponseType>(`/api/role/employees?page=${pageNo}`)
      .then((res) => {
        console.log(res.data);
        const { roles, totalPage } = res.data;
        setContent((prev) => ({
          ...prev,
          roles,
          totalPage,
        }));
        setLoading(false);
      });
  };
  const handlePageChange = (pageNo: number) => {
    router(`?page=${pageNo}`);
  };
  useEffect(() => {
    handleFetchUsers(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="px-4 py-2">
      {content.roles.length === 0 ? (
        <div className="min-h-[80vh] flex justify-center items-center">
          NO Employees
        </div>
      ) : (
        <div className="min-h-[80vh]">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {content.roles.map((role) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                    <Button
                      onClick={() =>
                        router(`/staff/calendar?roleId=${role._id}`)
                      }
                      variant="outline"
                      className="flex justify-center items-center cursor-pointer"
                    >
                      <Calendar />
                    </Button>
                    <Button
                      onClick={() =>
                        router(`/staff/shift?employeeId=${role._id}`)
                      }
                      variant="outline"
                      className="flex justify-center items-center cursor-pointer"
                    >
                      <ClockArrowUp />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center px-4">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </Button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {content.totalPage}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= content.totalPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const StaffPage = () => {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  return (
    <div>
      <div className="px-4 flex gap-4 justify-between items-center">
        <span className="flex gap-2">
          <Input className="w-40 md:w-60" />
          <Button variant="outline">
            <Search />
          </Button>
        </span>
        <span>
          <Button onClick={() => router("/staff/create")}>
            <PlusCircle />
            <span>Add Staff</span>
          </Button>
        </span>
      </div>
      <Staff page={page} />
    </div>
  );
};

export default StaffPage;
