import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user";
import { setUser } from "@/util/jwt";
import connection from "@/lib/conection";
import bcrypt from "bcryptjs";

connection();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  console.log(code);
  return NextResponse.json(
    { req: req, message: "login page." },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  // console.log(req);
  const info = await req.json();
  console.log(info);
  try {
    const user = await isRightUser(info.email, info.password);
    if (user?.message) {
      return NextResponse.json(user, { status: 401 });
    } else {
      const response = NextResponse.json(
        {
          message: `${user.username} welcome to app!`,
          user: user,
        },
        { status: 200 }
      );
      const jwtToken = setUser({ user });
      console.log("jwt token", jwtToken);
      response.cookies.set({
        name: "JWT_TOKEN",
        value: jwtToken,
      });
      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "server error!.", error: error },
      { status: 500 }
    );
  }
}

const isRightUser = async function (email: string, password: string) {
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return { message: "wrong email address.", status: 400 };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return { message: "wrong password.", status: 401 };
  }
  if (!user.isVerified) {
    return { message: "please verify your email.", status: 406 };
  }
  if (user.role !== "admin" && user.status !== "active") {
    return { message: "blocked by admin!!", status: 403 };
  }
  return user;
};
