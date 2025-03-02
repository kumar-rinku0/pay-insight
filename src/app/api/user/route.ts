import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/conection";

connection();

export async function GET() {
  console.log("GET request made to /api/user");
  return NextResponse.json({ message: "Hello User" });
}

export async function POST(req: NextRequest) {
  const info = await req.formData();
  console.log(info);
  return NextResponse.redirect("http://localhost:3000");
}
