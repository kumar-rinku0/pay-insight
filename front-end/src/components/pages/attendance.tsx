import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../provider/auth-provider";
// import { currntTimeInFixedFomat } from "../functions/DateFixer";
import axios from "axios";
import haversine from "../../util/haversine";

const Attendance = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isAuthenticated, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [allowLocation, setAllowLocation] = useState(false);
  const [branch, setBranch] = useState<{
    coordinates: [number, number] | null;
    radius: number | null;
  }>({ coordinates: null, radius: null });
  const [inputs, setInputs] = useState<{
    punchInGeometry: { type: string; coordinates: number[] } | null;
    punchOutGeometry: { type: string; coordinates: number[] } | null;
  }>({
    punchInGeometry: null,
    punchOutGeometry: null,
  });
  const [loading, setLoading] = useState(false);
  const [allowCamera, setAllowCamera] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (user && user?.company) {
      console.log(user.company);
      axios
        .post("/api/attendance/users/information/today", {
          userId: user._id,
          companyId: user.company._id,
          branchId: user.company.branch,
        })
        .then((res) => {
          console.log(res.data);
          setHasPunchedIn(!res.data.lastPuchedOut);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get("/api/branch/info")
        .then((res) => {
          console.log(res.data);
          const { coordinates, radius } = res.data;
          setBranch({ coordinates: coordinates, radius: radius });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  function getLocation(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        getCurrentPositionAsync()
          .then((position) => {
            showPosition(position);
            resolve(true);
          })
          .catch((error) => {
            showError(error);
            reject(false);
          });
      } else {
        alert("Geolocation is not supported by this browser.");
        reject(false);
      }
    });
  }

  interface Position {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  }

  function getCurrentPositionAsync(): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  }

  async function showPosition(position: Position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;
    console.log("lat:", lat, "lon:", lon, "acc:", acc);
    if (acc > 100) {
      alert("GPS signal is weak, Try moving to an open area.");
      return;
    }
    setAllowLocation(true);
    const coordinates = [lon, lat];
    const obj = { type: "Point", coordinates: coordinates };
    if (!hasPunchedIn) {
      setInputs((prev) => ({ ...prev, punchInGeometry: obj }));
    } else {
      setInputs((prev) => ({ ...prev, punchOutGeometry: obj }));
    }
    setAllowCamera(true);
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
      default:
        alert("An unknown error occurred.");
        break;
    }
  }

  function startCamera() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setAllowCamera(true);
          console.log("Camera stream started:", stream);
          resolve(stream);
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please check permissions.");
          reject(err);
        });
    });
  }

  // function stopCamera() {
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  //   }
  // }

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
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");
        console.log(formData.get("image"));
        if (!hasPunchedIn) {
          setInputs((prev) => ({
            ...prev,
            punchInPhoto: formData.get("image"),
          }));
        } else {
          setInputs((prev) => ({
            ...prev,
            punchOutPhoto: formData.get("image"),
          }));
        }
      });
      setAllowCamera(false);
    }
  }

  const handleAllowAccess = async () => {
    setDisableBtn(true);
    try {
      const isLocation = await getLocation();
      if (isLocation) {
        const stream = await startCamera(); // show camera only after location is fetched
        console.log(stream);
      }
    } catch (error) {
      console.error("Error in location/camera access:", error);
    }
    setDisableBtn(false);
  };

  const handlePunchIn = () => {
    setLoading(true);
    const coordinates = inputs?.punchInGeometry?.coordinates;
    if (!coordinates || coordinates.length <= 1) {
      return;
    }
    if (!branch.coordinates || !branch.radius) {
      return alert("Branch coordinates or radius are not available.");
    }
    const distance = haversine(
      branch.coordinates[1],
      branch.coordinates[0],
      coordinates[1],
      coordinates[0]
    );
    console.log("distance is :", distance);
    if (distance > branch.radius) {
      return alert(
        `distance: ${Math.round(distance).toFixed()}m should be less then ${
          branch.radius
        }m`
      );
    }
    if (isAuthenticated && user && user.company) {
      axios
        .post("/api/attendance/mark", {
          ...inputs,
          userId: user._id,
          companyId: user.company._id,
          branchId: user.company.branch,
        })
        .then((res) => {
          console.log(res.data);
          setHasPunchedIn(true);
          setInputs({
            punchInGeometry: null,
            punchOutGeometry: null,
          });
          setAllowLocation(false);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePunchOut = () => {
    setLoading(true);
    const coordinates = inputs?.punchOutGeometry?.coordinates;
    if (!coordinates || coordinates.length <= 1) {
      return;
    }
    if (!branch.coordinates || !branch.radius) {
      return alert("Branch coordinates or radius are not available.");
    }
    const distance = haversine(
      branch.coordinates[1],
      branch.coordinates[0],
      coordinates[1],
      coordinates[0]
    );
    console.log("distance is :", distance);
    if (distance > branch.radius) {
      return alert(
        `distance: ${Math.round(
          distance
        ).toLocaleString()}m should be less then ${branch.radius}m`
      );
    }
    if (isAuthenticated && user && user.company) {
      axios
        .put("/api/attendance/mark", {
          ...inputs,
          userId: user._id,
          companyId: user.company._id,
          branchId: user.company.branch,
        })
        .then((res) => {
          console.log(res.data);
          setInputs({
            punchInGeometry: null,
            punchOutGeometry: null,
          });
          setAllowLocation(false);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-w-full h-[100vh] cap flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center">
          Attendance
        </h1>
        <p className="mt-4 text-lg text-white/80 text-center">
          {new Date().toDateString()}
        </p>
        <h2 className="text-white/80 text-center mt-4">
          {user && `${user.name}`}
        </h2>
        <h2 id="coordinates" className="text-white/80 text-center mt-4">
          coordinates
        </h2>
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {/* Hidden video element for camera stream */}
        <div className="mt-4 flex flex-col gap-4">
          {!allowLocation && (
            <button
              onClick={() => handleAllowAccess()}
              disabled={disableBtn}
              className="px-4 py-2 bg-[#ff4444] text-white rounded-lg cursor-pointer focus:outline-none disabled:bg-[#ff4444]/40"
            >
              Allow Access!
            </button>
          )}
          {allowLocation && allowCamera && (
            <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border-4 border-white/50"></div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setAllowCamera(false);
                    setAllowLocation(false);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={disableBtn}
                  className="px-6 py-3 bg-green-500 text-white rounded-full"
                >
                  Capture
                </button>
              </div>
            </div>
          )}
          {allowLocation && !allowCamera && (
            <button
              onClick={() => {
                setAllowCamera(true);
              }}
              disabled={disableBtn}
              className="px-4 py-2 bg-[#ff4444] text-white rounded-lg cursor-pointer focus:outline-none disabled:bg-[#ff4444]/40"
            >
              Allow Camera!
            </button>
          )}
          {allowLocation && allowCamera && (
            <button
              disabled={loading}
              onClick={hasPunchedIn ? handlePunchOut : handlePunchIn}
              className="px-4 py-2 text-white bg-[#028a0f] rounded-lg cursor-pointer focus:outline-none disabled:bg-[#028a0f]/40"
            >
              {!loading && !hasPunchedIn && "Punch In"}
              {!loading && hasPunchedIn && "Punch Out"}
              {loading && hasPunchedIn && "Punching Out..."}
              {loading && !hasPunchedIn && "Punching In..."}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
