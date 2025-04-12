"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { ArrowLeft } from "lucide-react";
import { authorizeUrl } from "@/components/partial/google-auth";
import { useAuth } from "@/components/provider/auth-provider";

const formSchema = z.object({
  givenName: z.string().min(2, "at least 2 characters!").max(20),
  familyName: z.string().max(20).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

const Register = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Assuming you have a useAuth hook to check authentication status
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      givenName: "",
      familyName: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    axios
      .post("/api/user/register", values)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success(res.data.message);
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  }

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      <Button className="fixed top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="text-2xl" />
      </Button>
      <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="givenName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="familyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              </form>
            </Form>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="h-[1px] mx-4 w-full bg-slate-500" />
            <span className="text-sm text-slate-500">or</span>
            <div className="h-[1px] mx-4 w-full bg-slate-500" />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={isAuthenticated}
              onClick={() => router.push(authorizeUrl)}
            >
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Register;
