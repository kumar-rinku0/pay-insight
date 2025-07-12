import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/use-auth";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut } = useAuth();
  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handleDeleteAccount = () => {
    axios
      .delete(`/api/user/delete`)
      .then((res) => {
        console.log(res);
        signOut();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message || err.message);
      });
  };
  const handleDeleteCompanyRole = () => {
    axios
      .delete(`/api/role/delete`)
      .then((res) => {
        console.log(res);
        location.reload();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message || err.message);
      });
  };
  return (
    <div className="p-6 space-y-6">
      <h3 className="mb-4 text-lg font-medium">Account Settings</h3>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Info</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={user?.picture} alt={user.name} />
              <AvatarFallback className="rounded-lg text-lg font-medium">
                {user.name
                  .split(" ")
                  .map((name) => name[0].toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user?.role && (
                <p className="text-sm text-muted-foreground">
                  <span>Role:</span>
                  &nbsp;
                  <span className="font-bold">{user.role.role}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Display Name</CardTitle>
            <CardDescription>
              To update your display name, fill out the form below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your display name"
                defaultValue={user.name}
                className="w-60"
              />
              <Button type="submit">Save</Button>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        {/* delete company role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delete Company Role</CardTitle>
            <CardDescription>
              If you're no longer employee to company, click the button below.
              This action cannot be undone. This will permanently unlink your
              account with company and your metadata with company will be
              removed from our servers.
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash />
                    Delete Company Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently unlink
                      your account with company and your metadata with company
                      will be removed from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteCompanyRole}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </form>
          <CardFooter></CardFooter>
        </Card>
        {/* delete account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delete Account</CardTitle>
            <CardDescription>
              To delete your account, click the button below. This action cannot
              be undone. This will permanently delete your account and remove
              your data from our servers.
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash /> Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </form>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
