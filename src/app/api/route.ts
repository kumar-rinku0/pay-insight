import { NextRequest, NextResponse } from "next/server";
import conection from "@/lib/conection";
import { getUser } from "@/util/jwt";

conection();

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  // request.cookies.has("nextjs"); // => true
  // request.cookies.delete("nextjs");
  // request.cookies.has("nextjs"); // => false

  if (request.cookies.has("JWT_TOKEN")) {
    const cookie = request.cookies.get("JWT_TOKEN");
    console.log("jwt cookie", cookie);
    const user = getUser({ token: cookie?.value || "" });
    console.log("user -> ", user);
    if (!user) {
      return NextResponse.json({ message: "invalid token!", user: null });
    }
    return NextResponse.json({ message: "already logged in!", user: user });
  }

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.json({ message: "not logged in!", user: null });
  return response;
}
// Compare this snippet from src/api/route.ts:
