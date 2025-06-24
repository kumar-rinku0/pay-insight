"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Import Zod for validation
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/providers/use-auth"; // Adjust the import path as necessary

// Zod schema for frontend validation
const staffSchema = z.object({
  givenName: z.string().min(2, "name is required"),
  familyName: z.string().optional(),
  email: z
    .string()
    .email("Vailid email address?")
    .min(6, "Address is required"),
  role: z.enum(["admin", "manager", "employee"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});
const shiftSchema = z.object({
  type: z.string().min(2, "type is required"),
  startTime: z.string().min(2, "start time is required").optional(),
  endTime: z.string().min(2, "end time is required").optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;
type ShiftFormData = z.infer<typeof shiftSchema>;

const CreateStaff = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState<{
    overlay: boolean;
    branch: string | null;
    user: string | null;
  }>({ overlay: false, branch: null, user: null });
  const handleSetIsOpenOverlay = (value: boolean) => {
    setIsOpen((prev) => ({ ...prev, overlay: value }));
  };

  const handleSetIsOpenBranch = (value: string | null) => {
    setIsOpen((prev) => ({ ...prev, branch: value }));
  };
  const handleSetIsOpenUser = (value: string | null) => {
    setIsOpen((prev) => ({ ...prev, user: value }));
  };

  // const [isLoading, setIsLoading] = React.useState(false);

  // if (isAuthenticated && user && user?.roleInfo && user?.roleInfo?.company) {
  //   return <div>Loading... company</div>; // Show loading state while checking authentication
  // }
  // useEffect(() => {
  //   if (isAuthenticated && user && user?.roleInfo) {
  //     axios
  //       .get("/api/branch/companyId/" + user.roleInfo.company)
  //       .then((res) => {
  //         console.log(res.data);
  //         const { branches } = res.data;
  //         console.log("branches", branches);
  //         // if (branches.length === 0) {
  //         //   setIsOpen({ overlay: false, branch: true });
  //         // } else {
  //         //   setIsOpen({ overlay: true, branch: false });
  //         // }
  //       });
  //   }
  // }, [isAuthenticated, user]);

  if (isAuthenticated && user && user.role && user.role.branch) {
    return (
      <main className="flex h-[90vh] sm:h-screen justify-center items-center">
        {/* Staff Form */}
        {!isOpen.overlay && (
          <EmpoyeeDetails
            handleSetIsOpenOverlay={handleSetIsOpenOverlay}
            handleSetIsOpenUser={handleSetIsOpenUser}
            branchId={user.role.branch}
          />
        )}
        {isOpen.overlay && (
          <ShiftDetails user={isOpen.user} /> // Show shift form when overlay is open
        )}
      </main>
    );
  }

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      {/* Staff Form */}
      {!isOpen.branch && (
        <ShowBranches handleSetIsOpenBranch={handleSetIsOpenBranch} />
      )}
      {isOpen.branch && !isOpen.overlay && (
        <EmpoyeeDetails
          handleSetIsOpenOverlay={handleSetIsOpenOverlay}
          handleSetIsOpenUser={handleSetIsOpenUser}
          branchId={isOpen.branch}
        />
      )}
      {isOpen.branch && isOpen.overlay && (
        <ShiftDetails user={isOpen.user} /> // Show shift form when overlay is open
      )}
    </main>
  );
};

const ShowBranches = ({
  handleSetIsOpenBranch,
}: {
  handleSetIsOpenBranch: (value: string | null) => void;
}) => {
  type branchType = {
    _id: string;
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  const [branches, setBranches] = useState<branchType[] | null>(null);
  useEffect(() => {
    axios
      .get("/api/branch/company")
      .then((res) => {
        console.log(res.data);
        const { branches } = res.data;
        setBranches(branches);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
    return;
  }, []);

  if (!branches) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      {branches.length === 0 && (
        <CardHeader>
          <CardTitle className="text-xl">No Branches</CardTitle>
          <CardDescription>
            Please create a branch to add staff.
          </CardDescription>
          <CardContent className="flex justify-center items-center p-4">
            <Button onClick={() => location.assign("/branches/create")}>
              Create Branch
            </Button>
          </CardContent>
        </CardHeader>
      )}
      {branches.length > 0 && (
        <>
          <CardHeader>
            <CardTitle className="text-xl">Select Branch</CardTitle>
            <CardDescription>Select a branch to add!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {branches.map((branch) => (
                <Button
                  key={branch._id}
                  onClick={() => handleSetIsOpenBranch(branch._id)}
                >
                  {branch.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

const EmpoyeeDetails = ({
  handleSetIsOpenOverlay,
  handleSetIsOpenUser,
  branchId,
}: {
  handleSetIsOpenOverlay: (value: boolean) => void;
  handleSetIsOpenUser: (value: string | null) => void;
  branchId: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const form1 = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      givenName: "",
      familyName: "",
      email: "", // Set default if needed
      role: "employee",
    },
  });
  const {
    control: control1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = form1;

  const onStaffSubmit = async (data: StaffFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    setIsLoading(true);
    if (isAuthenticated && user && user.role) {
      axios
        .post("/api/user/registerbyrole", {
          ...data,
          companyId: user.role.company,
          branchId: branchId || user.role.branch,
        })
        .then((res) => {
          console.log(res);
          handleSetIsOpenUser(res.data.user._id); // Set the user ID for the shift form
          toast.success(res.data.message);
          handleSetIsOpenOverlay(true); // Open the shift form after staff creation
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        })
        .finally(() => {
          setIsLoading(false); // Reset loading state after API call
        });
    }
  };
  return (
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      <CardHeader>
        <CardTitle className="text-xl">Create Staff</CardTitle>
        <CardDescription>Enter staff information!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form1}>
          <form
            onSubmit={handleSubmit1(onStaffSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4">
              {/* First Name */}
              <FormField
                control={control1}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage>{errors1.givenName?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={control1}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        {...field}
                        className="input"
                      />
                    </FormControl>
                    <FormMessage>{errors1.familyName?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Company Email */}
              <FormField
                control={control1}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" {...field} />
                    </FormControl>
                    <FormMessage>{errors1.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Company Type */}
            <FormField
              control={control1}
              name="role"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[120px] sm:w-[180px]">
                        <SelectValue placeholder="Staff Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.role?.role === "admin" && (
                          <SelectItem value="admin">Admin</SelectItem>
                        )}
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors1.role?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Staff"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const ShiftDetails = ({ user }: { user: string | null }) => {
  const [selectedWeekOffs, setSelectedWeekOffs] = useState<string[]>([]);
  // React Hook Form setup with Zod validation
  const router = useNavigate();
  const form2 = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      type: "",
      startTime: "09:00", // Set default if needed
      endTime: "16:00",
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = form2;

  const onShiftSubmit = async (data: ShiftFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    console.log("Selected week off:", selectedWeekOffs); // Log the selected week off
    if (user) {
      axios
        .post("/api/shift/create", {
          ...data,
          userId: user,
          weekOffs: selectedWeekOffs,
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          router("/");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        });
    }
  };

  const handleWeekOffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDay = e.target.value; // Get selected day (e.g., 'mon', 'tue')
    console.log("Selected week off day:", selectedDay);

    // Update the selected day in state
    setSelectedWeekOffs((prevSelected) => {
      if (prevSelected.includes(selectedDay)) {
        // If it's already selected, remove it (deselect)
        return prevSelected.filter((day) => day !== selectedDay);
      } else {
        // Otherwise, add it to the selected days
        return [...prevSelected, selectedDay];
      }
    });
  };
  return (
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      <CardHeader>
        <CardTitle className="text-xl">Add Staff Shift</CardTitle>
        <CardDescription>Enter staff shift!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form2}>
          <form
            onSubmit={handleSubmit2(onShiftSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4">
              {/* First Name */}
              <FormField
                control={control2}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Shift Type" {...field} />
                    </FormControl>
                    <FormMessage>{errors2.type?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                {/* Start Time */}
                <FormField
                  control={control2}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="input" />
                      </FormControl>
                      <FormMessage>{errors2.startTime?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                {/*  End Time */}
                <FormField
                  control={control2}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="input" />
                      </FormControl>
                      <FormMessage>{errors2.endTime?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Company Email */}
              <FormLabel>Week Offs</FormLabel>
              <FormField
                name="weekOffs"
                render={({ field }) => (
                  <>
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                      (day) => (
                        <FormItem key={day} className="flex items-center gap-4">
                          <FormControl>
                            <Input
                              type="checkbox"
                              className="w-6 h-6"
                              value={day}
                              checked={selectedWeekOffs.includes(day)}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleWeekOffChange(e); // Call the handler
                              }}
                            />
                          </FormControl>
                          <FormLabel>{day}</FormLabel>
                        </FormItem>
                      )
                    )}
                  </>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Add Shift
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateStaff;
