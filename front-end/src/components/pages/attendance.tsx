import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/auth-provider";
// import { currntTimeInFixedFomat } from "../functions/DateFixer";
import axios from "axios";
import haversine from "../../util/haversine";

const Attendance = () => {
  const { isAuthenticated, user } = useAuth();
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

  function getLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        getCurrentPositionAsync()
          .then((position) => {
            showPosition(position);
            resolve();
          })
          .catch((error) => {
            showError(error);
            reject();
          });
      } else {
        alert("Geolocation is not supported by this browser.");
        reject();
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

  const handlePunchIn = async () => {
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
    setLoading(true);
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

  const handlePunchOut = async () => {
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
    setLoading(true);
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

        <div className="mt-4 flex flex-col gap-4">
          {!allowLocation && (
            <button
              onClick={() => getLocation()}
              className="px-4 py-2 bg-[#e94560] text-white rounded-lg cursor-pointer hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2"
            >
              Allow Access!
            </button>
          )}
          {allowLocation && (
            <button
              disabled={loading}
              onClick={hasPunchedIn ? handlePunchOut : handlePunchIn}
              className="px-4 py-2 bg-[#3ded97] text-white rounded-lg cursor-pointer hover:bg-[#028a0f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2"
            >
              {loading && !hasPunchedIn && "Punching In..."}
              {loading && hasPunchedIn && "Punching Out..."}
              {!loading && hasPunchedIn ? "Punch Out" : "Punch In"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
