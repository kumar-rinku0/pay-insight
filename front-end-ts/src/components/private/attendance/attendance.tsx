import { useState, useEffect, useRef } from "react";
import axios from "axios";
import haversine from "@/utils/haversine";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";

const Attendance = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { isAuthenticated, user } = useAuth();

  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [allowLocation, setAllowLocation] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [branch, setBranch] = useState<{
    coordinates: [number, number] | null;
    radius: number | null;
  }>({ coordinates: null, radius: null });

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
          startCamera();
          const { coordinates, radius } = res.data;
          setBranch({ coordinates, radius });
          setHasPunchedIn(!res.data.lastPuchedOut);
        })
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated, user]);

  const getLocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        reject();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          return resolve(position);
        },
        (error) => {
          let message = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get user location timed out.";
              break;
            default:
              message = "An unknown error occurred.";
              break;
          }
          alert(message);
          return reject();
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  };

  function showPosition(position: GeolocationPosition) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;

    if (acc > 100) {
      alert("GPS signal is weak. Try moving to an open area.");
      return;
    }

    const coordinates = [lon, lat];
    const geoPoint = { type: "Point", coordinates };

    setAllowLocation(true);
    setInputs((prev) => ({
      ...prev,
      ...(hasPunchedIn
        ? { punchOutGeometry: geoPoint }
        : { punchInGeometry: geoPoint }),
    }));
  }
  const startCamera = async () => {
    return navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Could not access the camera. Please check permissions.");
        throw err;
      });
  };

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob((blob) => {
        if (!blob) return;

        setInputs((prev) => ({
          ...prev,
          ...(hasPunchedIn ? { punchOutPhoto: blob } : { punchInPhoto: blob }),
        }));
        stopCamera();
        setPhotoCaptured(true);
      }, "image/jpeg");
    }
  }

  const handleAllowAccess = async () => {
    setDisableBtn(true);
    try {
      await startCamera();
      const position = await getLocation();
      showPosition(position);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setDisableBtn(false);
    }
  };

  const handlePunch = async () => {
    setLoading(true);

    const geo = hasPunchedIn ? inputs.punchOutGeometry : inputs.punchInGeometry;
    const photo = hasPunchedIn ? inputs.punchOutPhoto : inputs.punchInPhoto;

    if (!geo || geo.coordinates.length !== 2) {
      alert("Invalid or missing coordinates.");
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

    method(endpoint, {
      ...(hasPunchedIn
        ? { punchOutGeometry: geo, punchOutPhoto: photo }
        : { punchInGeometry: geo, punchInPhoto: photo }),
      roleId: user?.role._id,
    })
      .then((res) => {
        console.log("Punch successful:", res.data);
        setHasPunchedIn(!hasPunchedIn);
        setPhotoCaptured(false);
        setInputs({
          punchInGeometry: null,
          punchOutGeometry: null,
          punchInPhoto: null,
          punchOutPhoto: null,
        });
        setAllowLocation(false);
      })
      .catch((err) => {
        console.error("Punch error:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-w-full h-[100vh] cap flex items-center justify-center">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="relative w-full max-w-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* <div className="w-64 h-64 rounded-full border-4 border-white/50"></div> */}
          </div>
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
        {!allowLocation ? (
          <Button onClick={handleAllowAccess} disabled={disableBtn}>
            Allow Access!
          </Button>
        ) : !photoCaptured ? (
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAllowLocation(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={capturePhoto} disabled={disableBtn}>
              Capture
            </Button>
          </div>
        ) : (
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                setPhotoCaptured(false);
                setInputs((prev) => ({
                  ...prev,
                  punchInPhoto: null,
                  punchOutPhoto: null,
                }));
                await startCamera();
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
