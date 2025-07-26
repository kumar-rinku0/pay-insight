"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/providers/use-auth"; // Adjust the import path as necessary
import { useEffect, useState } from "react";
import type { CompanyType } from "@/types/res-type";

type ResponseType = {
  message: string;
  company: CompanyType;
};

// Zod schema for frontend validation
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  cin: z
    .string()
    .min(6, "CIN is required")
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      "5 latter, 4 numeric and 1 latter! only capital allowed."
    ),
  type: z.enum(["private", "public"]),
  branches: z.coerce
    .number()
    .min(1, "Branches count is required")
    .max(2, "Max limit 99 crossed!"),
});

type CompanyFormData = z.infer<typeof companySchema>;

const UpdateCompany = ({ company }: { company: CompanyType }) => {
  const router = useNavigate();
  const { isAuthenticated, user, signIn } = useAuth();
  // React Hook Form setup with Zod validation
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name || "",
      cin: company.cin || "",
      type: company.type as "public" | "private", // Set default if needed
      branches: company.branches,
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
        .put(`/api/company/update/companyId/${company._id}`, { ...data })
        .then((res) => {
          console.log(res);
          const { message, role } = res.data;
          signIn({ ...user, role: role });
          toast.success(message);
          router("/companies");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.message);
        });
    }
  };

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
        <CardHeader>
          <CardTitle className="text-xl">Update Company</CardTitle>
          <CardDescription>
            You can update your company information!
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

                {/* Company CIN */}
                <FormField
                  control={control}
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company CIN</FormLabel>
                      <FormControl>
                        <Input placeholder="CIN" {...field} />
                      </FormControl>
                      <FormMessage>{errors.cin?.message}</FormMessage>
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
                Update Company
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

const UpdateCompanyPage = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  const [company, setCompany] = useState<CompanyType | null>(null);
  useEffect(() => {
    if (companyId) {
      axios
        .get<ResponseType>(`/api/company/getOneByCompanyId/${companyId}`)
        .then((res) => {
          setCompany(res.data.company);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch company details.");
        });
    }
  }, [companyId]);

  if (!company) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <UpdateCompany company={company} />;
};

export default UpdateCompanyPage;
