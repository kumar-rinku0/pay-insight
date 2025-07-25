import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <>
      <div className="bg-[#f2fafc] dark:bg-transparent w-full h-[80vh] flex flex-col justify-center lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 lg:min-h-1/2 flex flex-col gap-4 text-center sm:text-start sm:gap-8 justify-center px-8 lg:px-16 xl:px-32 py-4">
          <h3 className="text-3xl font-semibold">Simplify Staff Management</h3>
          <p className="text-sm">
            Meet the smartest staff management system to manage attendance,
            payroll, compliances, and much more.
          </p>
          <Link to="/login" className="self-center w-60">
            <Button variant="outline" className="cursor-pointer w-full h-full">
              Login
            </Button>
          </Link>
        </div>
        <div className="w-full lg:w-1/2 flex items-center ">
          <div className="w-full relative h-96">
            <img
              src="/a2.png"
              alt="attendance img"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="h-fit">
        <Tips />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;

const Tips = () => {
  return (
    <div className="py-16 flex flex-col gap-2 lg:flex-row h-fit min-h-96">
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full relative max-h-96 max-w-xl flex justify-center">
          <img src={"/a-f.webp"} alt="feature pic" className="object-contain" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4 px-4">
        <h2 className="text-3xl font-bold">
          Spend less time and manage your employees smartly
        </h2>
        <div>
          <h3 className="text-xl font-semibold">Easy to use</h3>
          <p className="text-accent-foreground text-sm">
            Pay Insight is easy to use, with a simple and intuitive interface
            that makes navigating and handling its features effortless.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Safe and secured</h3>
          <p className="text-accent-foreground text-sm">
            With top-notch security and advanced encryption, our app ensures
            your data is protected and your privacy is respected.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">100% data backup</h3>
          <p className="text-accent-foreground text-sm">
            Rest easy with 100% data backup, ensuring all your employee
            management information are automatically updated on cloud.
          </p>
        </div>
        <Link to="/register" className="self-start">
          <Button className="cursor-pointer w-full h-full" variant="secondary">
            Create Account!
          </Button>
        </Link>
      </div>
    </div>
  );
};

import { Github, Instagram, Youtube, X, GhostIcon } from "lucide-react";

const Footer = () => {
  return (
    <div className="container w-full h-fit">
      <div className="flex flex-col md:flex-row justify-evenly items-center mb-5">
        <div className="flex flex-col justify-center items-center py-4">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            PayInsight
          </h3>
          <p className="text-gray-500 font-semibold text-sm">
            Let me help you to grow!!
            <span className="text-red-500"> ❤</span>
          </p>
        </div>
        <div className="w-fit">
          <GhostIcon />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-x-5 text-xs">
        <Link to="/terms">Terms and conditions</Link>
        <Link to="/privacy">Privacy policy</Link>
        <Link to="/contect">Contect</Link>
        <Link to="/">API docs</Link>
        <Link to="/policy">Refund policy</Link>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-around items-center my-5">
        <div className="flex flex-wrap justify-center items-center text-xs">
          Copyright © 2024 PayInsight, All rights reserved.
        </div>
        <div>
          <div className="flex flex-row gap-4 items-center p-10">
            <Link to={"/"}>
              <Github className="w-5" />
            </Link>
            <Link to={"/"}>
              <X className="w-5" />
            </Link>
            <Link to={"/"}>
              <Instagram className="w-5" />
            </Link>
            <Link to={"/"}>
              <Youtube className="w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
