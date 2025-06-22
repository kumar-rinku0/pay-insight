"use client";

import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/use-auth";
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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { RoleType } from "@/types/res-type";
import type { UserType } from "@/types/auth";
// import { authorizeUrl } from "@/components/partial/google-auth";

type ResponseProp = {
  user: UserType;
  role: RoleType;
  message: string;
};

const formSchema = z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(8).max(50),
});

const emailFormSchema = z.object({
  email: z.string().min(6).max(50).email(),
});

type LoadingProp = {
  button: boolean;
  forgetPassword: boolean;
  verifyUser: boolean;
  overlay: boolean;
  selectCompany: boolean;
};

const Login = () => {
  const [loading, setLoading] = useState<LoadingProp>({
    button: false,
    forgetPassword: false,
    verifyUser: false,
    overlay: false,
    selectCompany: false,
  });
  const router = useNavigate();

  function handleChageLoading(values: Partial<LoadingProp>): void {
    setLoading((prev) => ({ ...prev, ...values }));
  }

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      <Button className="fixed top-4 left-4" onClick={() => router(-1)}>
        <ArrowLeft className="text-2xl" />
      </Button>
      {!loading.overlay && (
        <LoginOverlay loading={loading} changeLoading={handleChageLoading} />
      )}
      {loading.overlay && (
        <EmailOverlay loading={loading} changeLoading={handleChageLoading} />
      )}
    </main>
  );
};

const EmailOverlay = ({
  loading,
  changeLoading,
}: {
  loading: LoadingProp;
  changeLoading: (values: Partial<LoadingProp>) => void;
}) => {
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    changeLoading({ button: true });
    console.log(values);
    if (loading.forgetPassword) {
      axios
        .post("/api/user/reset", values)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            toast.success("Email sent, to reset password.");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.error);
          console.log(err);
        })
        .finally(() => {
          changeLoading({ button: false });
        });
    } else if (loading.verifyUser) {
      axios
        .post("/api/user/verify", values)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            toast.success("Email sent, to verify email.");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.error);
          console.log(err);
        })
        .finally(() => {
          changeLoading({ button: false });
        });
    }
  }
  return (
    <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
      <CardHeader>
        {loading.verifyUser && (
          <>
            <CardTitle className="text-xl">Verifiy Email</CardTitle>
            <CardDescription>Enter your Email to Verify!.</CardDescription>
          </>
        )}
        {loading.forgetPassword && (
          <>
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your Email to reset password.
            </CardDescription>
          </>
        )}
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
              <div className="w-full flex justify-between gap-2">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-1/2"
                  onClick={() => changeLoading({ overlay: false })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading.button}
                  className="w-1/2"
                >
                  {loading.button ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

const LoginOverlay = ({
  loading,
  changeLoading,
}: {
  loading: LoadingProp;
  changeLoading: (values: Partial<LoadingProp>) => void;
}) => {
  // 1. Define your form.
  const router = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    changeLoading({ button: true });
    console.log(values);
    axios
      .post<ResponseProp>("/api/user/login", values)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          const { user, role, message } = res.data;
          signIn({ ...user, role: role });
          router("/");
          toast(message, {
            description: "remember password?",
            action: {
              label: "okay!",
              onClick: () => {
                axios
                  .patch(`/api/user/remember`)
                  .then((res) => {
                    location.reload();
                    toast.success(res.data.message);
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.message);
                  });
              },
            },
          });
        }
      })
      .catch((err) => {
        const { type, message } = err.response.data;
        toast.error(message);
        if (type === "EmailNotVerified") {
          changeLoading({ forgetPassword: false, verifyUser: true });
        } else if (type === "UserNotFound") {
          toast.error(message);
        } else if (type === "PasswordNotMatch") {
          changeLoading({ forgetPassword: true, verifyUser: false });
        }
      })
      .finally(() => {
        changeLoading({ button: false });
      });
  }
  return (
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading.verifyUser && (
                  <span
                    className="self-end text-sm underline cursor-pointer"
                    onClick={() => changeLoading({ overlay: true })}
                  >
                    verify email
                  </span>
                )}
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
                {loading.forgetPassword && (
                  <span
                    className="self-end text-sm underline cursor-pointer"
                    onClick={() => changeLoading({ overlay: true })}
                  >
                    forget password
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading.button}
              >
                {loading.button ? "Loading..." : "Login to App"}
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
            // onClick={() => router.push(authorizeUrl)}
          >
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
