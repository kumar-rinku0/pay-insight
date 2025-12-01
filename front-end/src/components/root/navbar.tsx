import { Link, Outlet } from "react-router";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/use-auth";
import { NavUserBubble } from "@/components/navigation/nav-user";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const RootNavbar = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <div>
      <nav className="px-4 w-full h-16 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="mr-2">
          <Button variant="link" size="lg">
            Pay Insight
          </Button>
        </Link>
        <div className="hidden md:flex ml-auto mr-4 justify-center items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white"
            >
              <Button variant="link" size="sm">
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
        {isAuthenticated ? (
          <NavUserBubble user={user!} logoutHandler={signOut} />
        ) : (
          <Link to="/login" className="mr-2">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </nav>
      <Outlet />
      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-5 text-xs md:gap-x-10 mb-4 space-y-2 md:space-y-0">
          <Link to="/terms">Terms and conditions</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/policy">Refund policy</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/">API docs</Link>
        </div>
        <p>© {new Date().getFullYear()} PayInsight. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default RootNavbar;
