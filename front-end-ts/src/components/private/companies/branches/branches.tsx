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
import type { BranchType } from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Branches = () => {
  const router = useNavigate();
  const { user } = useAuth();
  const [branches, setBranches] = useState<BranchType[] | null>(null);
  useEffect(() => {
    if (user) {
      axios
        .get(`/api/branch/company`)
        .then((res) => {
          console.log(res.data);
          const { branches } = res.data;
          setBranches(branches);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    }
    return;
  }, [user]);

  if (!branches) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      {branches.length === 0 && (
        <CardHeader>
          <CardTitle className="text-xl">No Branch</CardTitle>
          <CardDescription>
            You have not created any branches yet. Please create a branch to add
            staff.
          </CardDescription>
          <CardContent className="flex justify-center items-center p-4">
            <Button onClick={() => location.assign("/companies/create")}>
              Create Branch
            </Button>
          </CardContent>
        </CardHeader>
      )}
      {branches.length > 0 && (
        <>
          <CardHeader>
            <CardTitle className="text-xl">Branches</CardTitle>
            <CardDescription>
              Here are your branches. Click on a branch to view more details or
              manage it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {branches.map((branch: BranchType) => (
                <Button key={branch._id}>{branch.name}</Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router("/branches/create")}>
              Create New Branch
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Branches;
