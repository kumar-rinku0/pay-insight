import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const HandleCamera = ({
  onChangePunchingPhoto,
  updatePhotoCaptured,
}: {
  onChangePunchingPhoto: (photo: Blob | null) => void;
  updatePhotoCaptured: (isCaptured: boolean) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const startCamera = async () => {
    return navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          setIsCameraOn(true);
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
    setCapturing(true);
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

        // setInputs((prev) => ({
        //   ...prev,
        //   ...(hasPunchedIn ? { punchOutPhoto: blob } : { punchInPhoto: blob }),
        // }));
        onChangePunchingPhoto(blob);
        stopCamera();
        setCapturing(false);
        updatePhotoCaptured(true);
      }, "image/jpeg");
    }
  }

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
        </div>

        {isCameraOn ? (
          <Button onClick={capturePhoto} disabled={capturing}>
            {capturing ? "Capturing..." : "Capture Photo"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              startCamera();
            }}
          >
            Start Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default HandleCamera;
