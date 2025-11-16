import { Button } from "@/components/ui/button";
import { useState } from "react";

const HandleLocation = ({
  onChangePunchingGeometry,
  updateAllowedLocation,
}: {
  onChangePunchingGeometry: (
    geometry: { type: string; coordinates: number[] } | null
  ) => void;
  updateAllowedLocation: (allowed: boolean) => void;
}) => {
  const [disableBtn, setDisableBtn] = useState(false);

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
      return false;
    }

    const coordinates = [lon, lat];
    const geoPoint = { type: "Point", coordinates };

    onChangePunchingGeometry(geoPoint);

    return true;
  }
  const handleAllowAccess = async () => {
    setDisableBtn(true);
    try {
      const position = await getLocation();
      const isLocationAccurate = showPosition(position);
      if (isLocationAccurate) {
        updateAllowedLocation(true);
      }
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setDisableBtn(false);
    }
  };
  return (
    <div className="min-w-full h-[100vh] cap flex items-center justify-center">
      <Button onClick={handleAllowAccess} disabled={disableBtn}>
        Allow Location
      </Button>
    </div>
  );
};

export default HandleLocation;
