import { useParams, useSearchParams } from "react-router";

const UpdateAttendance = () => {
  const { day } = useParams<{ day: string }>();
  const [searchParmas] = useSearchParams();
  const attendanceId = searchParmas.get("attendanceId");
  const month = searchParmas.get("month");
  console.log(attendanceId, day, month);
  if (!attendanceId) {
    return null;
  }
  return <div>UpdateAttendance</div>;
};

export default UpdateAttendance;
