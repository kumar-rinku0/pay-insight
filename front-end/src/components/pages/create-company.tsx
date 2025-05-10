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
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { useAuth } from "../provider/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Zod schema for frontend validation
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  type: z.enum(["private", "public"]),
  branches: z.string().min(1, "Count is required").max(2, "Max limit crossed!"),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CreateCompany = () => {
  const router = useRouter();
  const { isAuthenticated, user, signIn } = useAuth();
  // React Hook Form setup with Zod validation
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      type: undefined, // Set default if needed
      branches: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: CompanyFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    if (isAuthenticated && user) {
      axios
        .post("/api/company/create", { ...data })
        .then((res) => {
          console.log(res);
          const { company } = res.data;
          signIn({ ...user, company: company });
          toast.success("Company created successfully!");
          router.push("/dashboard/branch");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        });
    }
  };

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
        <CardHeader>
          <CardTitle className="text-xl">Create Company</CardTitle>
          <CardDescription>
            Enter your company information to create a new Company!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-4">
                {/* Company Name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                {/* Company Phone */}
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage>{errors.phone?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Company Email */}
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage>{errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Company Type */}
                <FormField
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex justify-between items-center">
                      <FormLabel>Company Type</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[120px] sm:w-[180px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.type?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Company Address */}
                <FormField
                  control={control}
                  name="branches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Counts</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Branches"
                          type="number"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage>{errors.branches?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Create Company
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <p>
              Already have a company?{" "}
              <Link href="/companies" className="underline">
                View Companies
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateCompany;
