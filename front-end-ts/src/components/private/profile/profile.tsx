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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user, signOut } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
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
      });
  };
  return (
    <div className="p-6 space-y-6">
      <h3 className="mb-4 text-lg font-medium">Account Settings</h3>
      <div className="flex justify-around items-center flex-wrap gap-4">
        <Card className="min-w-xs min-h-60 md:min-w-sm lg:min-w-md">
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
        <Card className="min-w-xs min-h-60 md:min-w-sm lg:min-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Update Display Name</CardTitle>
            <CardDescription>
              To update your display name, fill out the form below.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your display name"
              defaultValue={user.name}
              className="w-full"
            />
            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card className="min-w-xs min-h-60 md:min-w-sm lg:min-w-md">
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </form>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
