import { useAuth } from "@/providers/use-auth";
import QuickNavigation from "./quick-nav";
import { NavItems } from "@/components/navigation/nav-config";

const Home = () => {
  const { user } = useAuth();
  const data = NavItems();
  const { employeeNavigation, adminNavigation, managerNavigation } =
    data.navMain;
  if (!user) {
    return null;
  }
  return (
    <div className="px-4 py-2 flex flex-col gap-4">
      <div>
        👋 Greetings, <strong>{user?.name ?? "User"}</strong>!
      </div>
      <div>
        Explore features like marking attendance, viewing reports, and checking
        your daily summary.
      </div>
      <div className="flex md:hidden">
        <div className="flex flex-col gap-2 justify-center items-center text-sm text-secondary-foreground">
          <p>
            <strong>Quick Navigation:</strong> Use these shortcuts to avoid
            opening the navigation panel on small devices!
          </p>
          <QuickNavigation
            items={
              user.role?.role === "admin"
                ? adminNavigation
                : user.role?.role === "manager"
                ? managerNavigation
                : employeeNavigation
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
