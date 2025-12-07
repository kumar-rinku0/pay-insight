import { Button } from "@/components/ui/button";

type DayButtonProps = {
  day: number;
  color: string;
  status: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const CalendarDayButton = ({ day, color, status, onClick }: DayButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.currentTarget.blur();
        onClick?.(e);
      }}
      className={`p-1 h-12 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
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
