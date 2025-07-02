import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      {companies.length === 0 && (
        <CardHeader>
          <CardTitle className="text-xl">No Companies</CardTitle>
          <CardDescription>
            You have not created any companies yet. Please create a company and
            its first branch to get started.
          </CardDescription>
          <CardContent className="flex justify-center items-center p-4">
            <Button onClick={() => location.assign("/companies/create")}>
              Create Company
            </Button>
          </CardContent>
        </CardHeader>
      )}
      {companies.length > 0 && (
        <>
          <CardHeader>
            <CardTitle className="text-xl">Companies</CardTitle>
            <CardDescription>
              Here are your companies. Click on a company to view more details
              or manage its branches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {companies.map((company: CompanyType) => (
                <Button key={company._id}>{company.name}</Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router("/companies/create")}>
              Create New Company
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Companies;
