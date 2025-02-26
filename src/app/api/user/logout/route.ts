import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/conection";

connection();

export async function GET(req: NextRequest) {
  req.cookies.delete("JWT_TOKEN");
  console.log(req.cookies.has("JWT_TOKEN")); // => false);
  const response = NextResponse.json(
    { message: "User Logged Out!", status: 200 },
    { status: 200 }
  );
  response.cookies.delete("JWT_TOKEN");
  return response;
}
