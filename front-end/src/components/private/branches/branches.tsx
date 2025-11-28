import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/use-auth";
import type { BranchType } from "@/types/res-type";
import axios from "axios";
import { Edit, PlusCircle, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          toast.error(err.response.data.message || err.message);
        });
    }
    return;
  }, [user]);

  const handleDeleteBranch = (branchId: string) => {
    axios
      .delete(`/api/branch/delete/branchId/${branchId}`)
      .then((res) => {
        console.log(res.data);
        toast.success("Branch deleted successfully!");
        setBranches(
          (prev) => prev && prev.filter((branch) => branch._id !== branchId)
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message || err.message);
      });
  };

  if (!branches) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {branches.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col gap-2 justify-center items-center">
          <span className="text-2xl font-bold">NO Branches!</span>
          <span className="text-gray-500 text-center">
            You have not created any branches yet. Please create a branch and
            add employees.
          </span>
          <Button onClick={() => router("/app/branches/create")}>
            Create New Branch
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
                <th className="hidden lg:flex px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Radius
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {branches.map((branch) => (
                <tr key={branch._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {branch.name}
                  </td>
                  <td className="hidden lg:flex px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {branch.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {branch.radius}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router(`/app/branches/update?branchId=${branch._id}`)
                        }
                      >
                        <Edit />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Trash />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your branch of company and your
                              metadata with branch will be removed from our
                              servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteBranch(branch._id)}
                              >
                                Delete Branch
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const BranchesPage = () => {
  const router = useNavigate();
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
          <Button onClick={() => router("/app/branches/create")}>
            <PlusCircle />
            <span>Create Branch</span>
          </Button>
        </span>
      </div>
      <Branches />
    </div>
  );
};

export default BranchesPage;
