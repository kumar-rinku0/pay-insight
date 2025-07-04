import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/use-auth";
import type { CompanyType } from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Companies = () => {
  const router = useNavigate();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyType[] | null>(null);
  useEffect(() => {
    if (user) {
      axios
        .get(`/api/company/userId/${user._id}`)
        .then((res) => {
          console.log(res.data);
          const { companies } = res.data;
          setCompanies(companies);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    }
    return;
  }, [user]);

  if (!companies) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {companies.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col gap-2 justify-center items-center">
          <span className="text-2xl font-bold">NO Companies!</span>
          <span className="text-gray-500 text-center">
            You have not created any companies yet. Please create a company and
            its first branch to get started.
          </span>
          <Button onClick={() => router("/companies/create")}>
            Create New Company
          </Button>
        </div>
      ) : (
        <div className="min-h-[80vh]">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branches
                </th>
                <th className="hidden lg:flex px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.branches}
                  </td>
                  <td className="hidden lg:flex px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* <div className="flex justify-between items-center px-4">
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
      </div> */}
    </div>
  );
};

export default Companies;
