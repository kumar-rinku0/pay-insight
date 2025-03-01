"use client";

import axios from "axios";
import Header from "@/components/partial/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/provider/auth-provider";
import { LoaderPinwheel } from "lucide-react";

export default function Home() {
  const auth = useAuth();

  if (auth?.loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <LoaderPinwheel className="animate-spin h-10 w-10" />
      </div>
    );
  }

  const handleClick = () => {
    axios
      .get("/api/user")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="app">
      <Header root={true} />
      <h1>Welcome to my front-end application</h1>
      <button onClick={handleClick}>user</button>
      <Link href="/login"> login</Link>
      <Link href="/register"> register</Link>
      <Button onClick={auth?.signOut}>logout</Button>
    </div>
  );
}
