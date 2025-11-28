import { Link, Outlet } from "react-router";
import { Button } from "../ui/button";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const RootNavbar = () => {
  return (
    <div>
      <nav className="px-4 w-full h-16 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary dark:text-white">
          Pay Insight
        </h1>
        <div className="hidden md:flex ml-auto mr-4 justify-center items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Link to="/login" className="mr-2">
          <Button variant="outline">Login</Button>
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default RootNavbar;
