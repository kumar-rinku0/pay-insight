import { useState, useEffect } from "react";
import axios from "axios";
import haversine from "@/utils/haversine";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import HandleLocation from "./handle-location";
import HandleCamera from "./handle-camera";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { ShiftType } from "@/types/res-type";
import { Skeleton } from "@/components/ui/skeleton";

const Attendance = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useNavigate();
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [allowLocation, setAllowLocation] = useState(false);
  const [allowedCamera, setAllowedCamera] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [timeScreen, setTimeScreen] = useState(true);

  const [branch, setBranch] = useState<{
    coordinates: [number, number] | null;
    radius: number | null;
    shift: ShiftType | null;
  }>({ coordinates: null, radius: null, shift: null });

  const [inputs, setInputs] = useState<{
    punchInGeometry: { type: string; coordinates: number[] } | null;
    punchOutGeometry: { type: string; coordinates: number[] } | null;
    punchInPhoto: Blob | null;
    punchOutPhoto: Blob | null;
  }>({
    punchInGeometry: null,
    punchOutGeometry: null,
    punchInPhoto: null,
    punchOutPhoto: null,
  });

  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      axios
        .get("/api/attendance/users/information/today")
        .then((res) => {
          console.log("Attendance info:", res.data);
          const { coordinates, radius, shift } = res.data;
          setBranch({ coordinates, radius, shift });
          setHasPunchedIn(!res.data.lastPuchedOut);
        })
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated, user]);

  const handlePunch = async () => {
    setLoading(true);

    const geo = hasPunchedIn ? inputs.punchOutGeometry : inputs.punchInGeometry;
    const photo = hasPunchedIn ? inputs.punchOutPhoto : inputs.punchInPhoto;

    if (!geo || geo.coordinates.length !== 2) {
      toast.error("invalid or missing coordinates.");
      // alert("invalid or missing coordinates.");
      setAllowLocation(false);
      setLoading(false);
      return;
    }

    if (!photo) {
      alert("Photo is required. Please capture a photo.");
      setLoading(false);
      return;
    }

    if (!branch.coordinates || typeof branch.radius !== "number") {
      alert("Branch location is not properly configured.");
      setLoading(false);
      return;
    }

    const distance = haversine(
      branch.coordinates[1],
      branch.coordinates[0],
      geo.coordinates[1],
      geo.coordinates[0]
    );

    if (distance > branch.radius) {
      alert(
        `You're too far from the branch. Distance: ${Math.round(
          distance
        )}m. Allowed: ${branch.radius}m.`
      );
      setLoading(false);
      return;
    }

    const endpoint = hasPunchedIn
      ? "/api/attendance/mark"
      : "/api/attendance/mark";
    const method = hasPunchedIn ? axios.put : axios.post;

    method(
      endpoint,
      {
        ...(hasPunchedIn
          ? { punchOutGeometry: geo, punchOutPhoto: photo }
          : { punchInGeometry: geo, punchInPhoto: photo }),
        roleId: user?.role._id,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res) => {
        console.log(res.data.message, res.data);
        toast.success(res.data.message);
        setHasPunchedIn(!hasPunchedIn);
        setPhotoCaptured(false);
        setInputs({
          punchInGeometry: null,
          punchOutGeometry: null,
          punchInPhoto: null,
          punchOutPhoto: null,
        });
        setAllowLocation(false);
        router("/app/calendar");
      })
      .catch((err) => {
        console.error("Punch error:", err);
      })
      .finally(() => setLoading(false));
  };

  if (timeScreen) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-4 justify-center items-center">
        <div className="flex justify-center items-center gap-2">
          <div>Time :</div>
          <LiveClock />
        </div>
        {!branch.shift ? (
          <div className="flex flex-col gap-4 justify-center items-center">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-9 w-[5rem]" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex justify-center">
              {!hasPunchedIn ? (
                <div>
                  Mark Punching In Before{" "}
                  {new Date(
                    getTodayTimestamp(branch.shift.startTime)
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              ) : (
                <div>
                  Mark Puching Out After{" "}
                  {new Date(
                    getTodayTimestamp(branch.shift.startTime)
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
            <div>
              <Button onClick={() => setTimeScreen(false)}>
                {!hasPunchedIn ? "Punch IN" : "Punch OUT"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!allowLocation) {
    return (
      <HandleLocation
        onChangePunchingGeometry={(
          geoPoint: { type: string; coordinates: number[] } | null
        ) => {
          setInputs((prev) => ({
            ...prev,
            ...(hasPunchedIn
              ? { punchOutGeometry: geoPoint }
              : { punchInGeometry: geoPoint }),
          }));
        }}
        updateAllowedLocation={(allowed: boolean) => {
          setAllowLocation(allowed);
        }}
      />
    );
  }

  if (!allowedCamera) {
    return (
      <HandleCamera
        onChangePunchingPhoto={(photo: Blob | null) => {
          setInputs((prev) => ({
            ...prev,
            ...(hasPunchedIn
              ? { punchOutPhoto: photo }
              : { punchInPhoto: photo }),
          }));
        }}
        updatePhotoCaptured={(isCaptured: boolean) => {
          setPhotoCaptured(isCaptured);
          setAllowedCamera(true);
        }}
      />
    );
  }

  return (
    <div className="min-w-full h-[100vh] cap flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>
          {/* Display captured photos if available */}
          {inputs.punchInPhoto && !hasPunchedIn && (
            <div className="mt-4 flex justify-center">
              <img
                src={URL.createObjectURL(inputs.punchInPhoto)}
                alt="Punch-in photo"
                className="w-32 h-32 rounded-full object-cover border-2 border-green-500"
              />
            </div>
          )}

          {inputs.punchOutPhoto && hasPunchedIn && (
            <div className="mt-4 flex justify-center">
              <img
                src={URL.createObjectURL(inputs.punchOutPhoto)}
                alt="Punch-out photo"
                className="w-32 h-32 rounded-full object-cover border-2 border-red-500"
              />
            </div>
          )}
        </div>
        {photoCaptured && (
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                setAllowedCamera(false);
              }}
            >
              Recapture
            </Button>
            <Button disabled={loading} onClick={handlePunch}>
              {loading
                ? hasPunchedIn
                  ? "Punching Out..."
                  : "Punching In..."
                : hasPunchedIn
                ? "Punch Out"
                : "Punch In"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {time.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </div>
  );
}

export function getTodayTimestamp(timeStr: string, extraMinutes = 0) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return (
    new Date(`${today} ${hours}:${minutes}:00 GMT+0530`).getTime() +
    extraMinutes * 60 * 1000
  );
}
