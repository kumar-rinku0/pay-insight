import { useAuth } from "@/providers/use-auth";
import type { ShiftType } from "@/types/res-type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ShowShifts = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [shift, setShift] = useState<ShiftType | null>(null);
  useEffect(() => {
    // Fetch existing shift data if needed
    if (user) {
      if (!user.role.branch) {
        toast.error("No branch assigned to the user.");
        return;
      }
      handleFetchShift(user.role._id);
    }
  }, [isAuthenticated, user]);

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
  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center">
      {shift ? (
        <ShiftDetailsCard shift={shift} />
      ) : (
        <p>No shift data available.</p>
      )}
    </div>
  );
};

const ShiftDetailsCard = ({ shift }: { shift: ShiftType }) => {
  return (
    <div className="max-w-md md:min-w-sm mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Shift Details
      </h2>

      <div className="space-y-3 text-gray-700">
        <DetailRow label="Shift Type" value={shift.type} />
        <DetailRow label="Start Time" value={shift.startTime} />
        <DetailRow label="End Time" value={shift.endTime} />
        <DetailRow label="Mark As Late Delay" value={`${shift.lateBy} min`} />
        <DetailRow
          label="Mark As Half Day Delay"
          value={`${shift.halfDayLateBy} min`}
        />
        <DetailRow
          label="WeekOffs"
          value={
            Array.isArray(shift.weekOffs)
              ? shift.weekOffs.join(", ")
              : shift.weekOffs
          }
        />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default ShowShifts;
