import { Button } from "@/components/ui/button";

type DayButtonProps = {
  day: number;
  status: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const colorMap = [
  { id: "on time", name: "On Time", color: "bg-green-500" },
  { id: "late", name: "Late", color: "bg-green-500" },
  { id: "half day", name: "Half Day", color: "bg-yellow-500" },
  { id: "absent", name: "Absent", color: "bg-red-500" },
  { id: "holiday", name: "Holiday", color: "bg-gray-500" },
];

const CalendarDayButton = ({ day, status, onClick }: DayButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.currentTarget.blur();
        onClick?.(e);
      }}
      className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${
        colorMap.find((c) => c.id === status)?.color || "bg-gray-300"
      } hover:opacity-80`}
      title={status}
    >
      <span className="absolute top-1 left-0 right-0 text-[0.8rem]">{day}</span>
      <span
        className={`absolute bottom-1 left-0 right-0 text-[0.6rem] ${
          ["late", "half day"].includes(status) ? "" : "opacity-0"
        }`}
      >
        {status}
      </span>
    </Button>
  );
};

export default CalendarDayButton;
