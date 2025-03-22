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

// Zod schema for frontend validation
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(6, "Address is required"),
  radius: z.number().min(1, "Count is required").max(2, "Max limit crossed!"),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CreateBranch = () => {
  const { isAuthenticated, user, signIn } = useAuth();
  // React Hook Form setup with Zod validation
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "", // Set default if needed
      radius: undefined,
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
      <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
        <CardHeader>
          <CardTitle className="text-xl">Create Branch</CardTitle>
          <CardDescription>Enter your branch information!</CardDescription>
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
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Branch Name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Company Email */}
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Branch Address" {...field} />
                      </FormControl>
                      <FormMessage>{errors.address?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Company Address */}
                <FormField
                  control={control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Counts</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Branch Radius"
                          type="number"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage>{errors.radius?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Create Branch
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateBranch;
