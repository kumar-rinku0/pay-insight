import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/conection";
import User from "@/model/user";
import { setUser } from "@/util/jwt";

connection();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const TOKEN = searchParams.get("TOKEN");
  const user = await User.findOne({ verifyToken: TOKEN });
  if (user && user.isVerified) {
    return NextResponse.json({
      message: "User already verified.",
      status: 400,
    });
  } else if (user && user.verifyTokenExpire > Date.now()) {
    const res = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verifyToken: null,
      },
      { new: true }
    );
    const response = NextResponse.json({
      message: "User verified!",
      status: 200,
      user: res,
    });
    const jwtToken = setUser({ user });
    response.cookies.set({
      name: "JWT_TOKEN",
      value: jwtToken,
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ message: "Invalid token.", status: 400 });
}
