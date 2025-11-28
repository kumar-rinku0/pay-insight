import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";

const Session = () => {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  const handleSaveSession = (value: boolean) => {
    if (value) {
      axios
        .patch(`/api/user/remember`)
        .then((res) => {
          router(next || "/app");
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router(next || "/app");
    }
  };
  useEffect(() => {
    if (!next) {
      location.assign("/app");
    }
  }, [next]);

  if (!next) {
    return null;
  }
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="flex flex-col gap-2 max-w-xs p-8 bg-accent rounded-2xl">
        <h3 className="text-xl font-bold">Save your login info?</h3>
        <p className="text-sm">
          We can save your login information on this browser so that you won't
          need to enter it again.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => handleSaveSession(true)}>Save Info</Button>
          <Button variant="outline" onClick={() => handleSaveSession(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Session;

// if (res.status === 200) {
//   const { user, role, message } = res.data;
//   signIn({ ...user, role: role });
//   toast(message, {
//     description: "remember password?",
//     action: {
//       label: "okay!",
//       onClick: () => {
//         axios
//           .patch(`/api/user/remember`)
//           .then(() => {
//             location.reload();
//           })
//           .catch((err) => {
//             console.log(err);
//             toast.error(err.response.data.message);
//           });
//       },
//     },
//   });
// }
