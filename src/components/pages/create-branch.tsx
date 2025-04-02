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
import { toast } from "sonner";
import { useRoute } from "../provider/route-provider";

// Zod schema for frontend validation
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(6, "Address is required"),
  isCoordinates: z.boolean(),
  radius: z.coerce
    .number()
    .min(10, "Count is required")
    .max(500, "Max limit crossed!"),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CreateBranch = () => {
  const { isAuthenticated, user } = useAuth();
  const { resetRoute } = useRoute();
  const [geolocation, setGeolocation] = React.useState<[number, number] | null>(
    null
  );
  // React Hook Form setup with Zod validation
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "", // Set default if needed
      radius: 20,
      isCoordinates: false,
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
    getLocation();
    if (isAuthenticated && user && user.company) {
      axios
        .post("/api/branch/create", {
          ...data,
          _id: user._id,
          company: user.company._id,
          geometry: { type: "Point", coordinates: geolocation },
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          resetRoute("staff");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        });
    }
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError, {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 10000, // Timeout after 10 seconds if no location is found
        maximumAge: 0, // Do not use a cached position
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  interface Position {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  }

  function showPosition(position: Position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;
    console.log("lat:", lat, "lon:", lon, "acc:", acc);
    if (acc > 50) {
      return alert(`accuracy is too large ${acc}`);
    }
    setGeolocation([lon, lat]);
  }

  function showError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
    }
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      getLocation();
      if (!geolocation) {
        event.target.checked = false;
      }
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
                {/* Coordiantes Select */}
                <FormField
                  control={control}
                  name="isCoordinates"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormControl>
                        <Input
                          type="checkbox"
                          placeholder="Branch Address"
                          className="w-6 h-6"
                          {...field}
                          value={field.value ? "true" : "false"}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            handleCheckboxChange(e);
                          }}
                        />
                      </FormControl>
                      <FormLabel>pick current location coordiantes?</FormLabel>
                      <FormMessage>{errors.isCoordinates?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Branch Radius */}
                <FormField
                  control={control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Radius</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Branch Radius"
                          type="number"
                          {...field}
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
