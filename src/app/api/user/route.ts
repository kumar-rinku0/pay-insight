import { NextResponse } from "next/server";
import connection from "@/lib/conection";

connection();

export async function GET() {
  console.log("GET request made to /api/user");
  return NextResponse.json({ message: "Hello User" });
}
