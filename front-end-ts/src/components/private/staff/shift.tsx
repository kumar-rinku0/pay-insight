import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import type { ShiftType } from "@/types/res-type";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const shiftSchema = z.object({
  type: z.string().min(2, "type is required"),
  startTime: z.string().min(2, "start time is required").optional(),
  endTime: z.string().min(2, "end time is required").optional(),
});
type ShiftFormData = z.infer<typeof shiftSchema>;

export const StaffShift = ({
  employeeId,
  shift,
}: {
  employeeId: string | null;
  shift?: ShiftType | null;
}) => {
  const router = useNavigate();
  const [selectedWeekOffs, setSelectedWeekOffs] = useState<string[]>(
    shift?.weekOffs || []
  ); // Initialize with existing week offs if available

  // React Hook Form setup with Zod validation
  const form2 = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      type: shift?.type || "", // Use existing shift type if available
      startTime: shift?.startTime || "09:00", // Use existing start time if available
      endTime: shift?.endTime || "16:00", // Use existing end time if available
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = form2;

  // Function to handle form submission
  // This function will be called when the form is submitted
  const onShiftSubmit = async (data: ShiftFormData) => {
    // Handle the form data submission to the backend (e.g., API call)
    console.log(data);
    console.log("Selected week off:", selectedWeekOffs); // Log the selected week off
    if (!shift) {
      axios
        .post("/api/shift/create", {
          ...data,
          employeeId: employeeId,
          weekOffs: selectedWeekOffs,
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          router("/staff");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.message);
        });
    } else {
      axios
        .put(`/api/shift/update/shiftId/${shift._id}`, {
          ...data,
          weekOffs: selectedWeekOffs,
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          router("/staff");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.message);
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
        <CardTitle className="text-xl">
          {shift ? "Change Shift" : "Create Shift"}
        </CardTitle>
        <CardDescription>Enter shift details!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form2}>
          <form
            onSubmit={handleSubmit2(onShiftSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4">
              {/* Shift Name */}
              <FormField
                control={control2}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Shift Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">MORNING</SelectItem>
                          <SelectItem value="night">NIGHT</SelectItem>
                          <SelectItem value="noon">NOON</SelectItem>
                          <SelectItem value="evening">EVENING</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <div className="flex flex-wrap gap-8">
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                      (day) => (
                        <FormItem key={day} className="flex items-center gap-1">
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
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {shift ? "Change Shift" : "Create Shift"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const Shift = () => {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId");
  const [loading, setLoading] = useState<boolean>(false);
  const [shift, setShift] = useState<ShiftType | null>(null);
  useEffect(() => {
    // Fetch existing shift data if needed
    if (employeeId) {
      handleFetchShift(employeeId);
    }
  }, [employeeId]);

  const handleFetchShift = (employeeId: string) => {
    setLoading(true);
    axios
      .get(`/api/shift/employeeId/${employeeId}`)
      .then((res) => {
        console.log(res.data);
        setShift(res.data.shift);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!employeeId || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!shift) {
    return <StaffShift employeeId={employeeId} />;
  }

  return <StaffShift employeeId={employeeId} shift={shift} />;
};

export default Shift;
