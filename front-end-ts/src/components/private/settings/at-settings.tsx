"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/providers/use-auth";

const FormSchema = z.object({
  selfieeAttendance: z.boolean().default(false).optional(),
  geocodeAttendance: z.boolean(),
});

const ATSettings = () => {
  const { user } = useAuth();
  if (!user) return null;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selfieeAttendance: true,
      geocodeAttendance: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">
            Attendance Settings
            {user.role.role !== "admin" && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (Read-Only)
              </span>
            )}
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="selfieeAttendance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Selfie Attendance</FormLabel>
                    <FormDescription>
                      Selfie attendance is a feature that allows you to track
                      attendance using selfies.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={user.role.role !== "admin"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="geocodeAttendance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Geocode Attendance</FormLabel>
                    <FormDescription>
                      Geocoding attendance is a feature that allows you to track
                      the geographical location of your attendance.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={user.role.role !== "admin"} // Make it read-only for non-admin users
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ATSettings;
