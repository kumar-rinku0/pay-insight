"use client";

import React from "react";
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
import { useAuth } from "../provider/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Zod schema for frontend validation
const staffSchema = z.object({
  givenName: z.string().min(2, "name is required"),
  familyName: z.string().min(2, "name is required").optional(),
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
  workDays: z.number().min(4, "work days is required"),
});

type StaffFormData = z.infer<typeof staffSchema>;
type ShiftFormData = z.infer<typeof shiftSchema>;

const CreateStaff = () => {
  const { isAuthenticated, user, signIn } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  // React Hook Form setup with Zod validation
  const form1 = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      givenName: "",
      familyName: "",
      email: "", // Set default if needed
      role: "employee",
    },
  });

  const form2 = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      type: "",
      startTime: "09:00", // Set default if needed
      endTime: "16:00",
      workDays: undefined,
    },
  });
  const {
    control: control1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = form1;
  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = form2;

  const onStaffSubmit = async (data: StaffFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    if (isAuthenticated && user) {
      axios
        .post("/api/company/create", { ...data, _id: user._id })
        .then((res) => {
          console.log(res);
          const { company } = res.data;
          signIn({ ...user, company: company });
          alert("Company created successfully!");
          setIsOpen(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onShiftSubmit = async (data: ShiftFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    if (isAuthenticated && user) {
      axios
        .post("/api/company/create", { ...data, _id: user._id })
        .then((res) => {
          console.log(res);
          const { company } = res.data;
          signIn({ ...user, company: company });
          alert("Company created successfully!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      {/* Staff Form */}
      {!isOpen && (
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
                            <SelectItem value="admin">Admin</SelectItem>
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
                <Button type="submit" className="w-full">
                  Add Staff
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      {isOpen && (
        <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
          <CardHeader>
            <CardTitle className="text-xl">Add Shift</CardTitle>
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
                          <FormMessage>
                            {errors2.startTime?.message}
                          </FormMessage>
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
                  <FormField
                    control={control2}
                    name="workDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Days</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="work days"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{errors1.email?.message}</FormMessage>
                      </FormItem>
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
      )}
    </main>
  );
};

export default CreateStaff;
