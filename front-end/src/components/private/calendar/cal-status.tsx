import { type DayStatusWithMonth } from "@/components/private/calendar/calendar";

const CalendarStatus = ({
  status,
  closeStatus,
}: {
  status: DayStatusWithMonth;
  closeStatus: () => void;
}) => {
  return (
    <div>
      <div>
        <button onClick={() => closeStatus()}>close</button>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CalendarStatus;
