import { type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";

const QuickNavigation = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  const router = useNavigate();
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center flex-wrap gap-4">
        {items.map((item) => (
          <div
            className="flex flex-col justify-center items-center p-2 bg-accent rounded-2xl min-w-32 min-h-28 select-none cursor-pointer"
            key={item.url}
            onClick={() => router(item.url)}
          >
            <div>{item.icon && <item.icon />}</div>
            <div>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickNavigation;
