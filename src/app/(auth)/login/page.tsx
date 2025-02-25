"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(2).max(20),
  password: z.string().min(8).max(50),
});

const emailFormSchema = z.object({
  email: z.string().min(6).max(50).email(),
});

const Login = () => {
  const [loading, setLoading] = useState({
    button: false,
    password: false,
    overlay: false,
  });
  const auth = useAuth();
  if (!auth?.loading && auth?.isAuthenticated) {
    redirect("/");
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading((values) => ({ ...values, button: true }));
    console.log(values);
    axios
      .post("/api/user/login", values)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          const { username, _id, email } = res.data.user;
          auth?.signIn({ username, _id, email });
        } else {
          console.log(res.data.message);
          setLoading((values) => ({ ...values, password: true }));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading((values) => ({ ...values, button: false }));
      });
  }

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setLoading((values) => ({ ...values, button: true }));
    console.log(values);
    axios
      .post("/api/user/reset", values)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          console.log("Email sent, to reset password.");
        } else if (res.data.status === 400) {
          console.log("Incorrect mail address!");
        } else {
          console.log("Server Error!");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading((values) => ({ ...values, button: false }));
      });
  }

  function handleForgetPassword() {
    setLoading((values) => ({ ...values, overlay: true }));
    // axios.get("/api/user/reset");
    // setLoading((values) => ({ ...values, password: false }));
  }

  function handleCancel() {
    setLoading((values) => ({ ...values, overlay: false }));
  }

  return (
    <main className="flex h-screen justify-center items-center">
      {!loading.overlay && (
        <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your information to log in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
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
                    <span
                      className="self-end text-sm underline cursor-pointer"
                      onClick={handleForgetPassword}
                    >
                      forget password
                    </span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading.button}
                  >
                    {loading.button ? "Loading..." : "Login to App"}
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    Login with Google
                  </Button>
                </form>
              </Form>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      {loading.overlay && (
        <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
          <CardHeader>
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your Email to reset password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(handleSubmitEmail)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email Address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={"outline"}
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading.button}
                    >
                      {loading.button ? "Loading..." : "Reset Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default Login;
