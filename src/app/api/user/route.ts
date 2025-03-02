import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/conection";
import { getInfo } from "@/util/jwt";
import User from "@/model/user";
import { JwtPayload } from "jsonwebtoken";

connection();

export async function GET() {
  console.log("GET request made to /api/user");
  return NextResponse.json({ message: "Hello User" });
}

export async function POST(req: NextRequest) {
  const info = await req.formData();
  const credential = info.get("credential");
  const googleUser = getInfo(credential as string);
  if (!googleUser || typeof googleUser === "string") {
    return NextResponse.json({ error: "Invalid credential" }, { status: 400 });
  }
  const userbyemail = await User.findOne({
    email: (googleUser as JwtPayload).email,
  });
  if (userbyemail) {
    return NextResponse.json(
      {
        message: `${userbyemail.givenName} ${userbyemail.familyName} welcome back!`,
        user: userbyemail,
      },
      { status: 200 }
    );
  }
  const user = new User({
    email: (googleUser as JwtPayload).email,
    givenName: (googleUser as JwtPayload).given_name,
    familyName: (googleUser as JwtPayload).family_name,
    isVerified: (googleUser as JwtPayload).email_verified,
    picture: (googleUser as JwtPayload).picture,
    password: (googleUser as JwtPayload).sub,
  });
  try {
    await user.save();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "user not created.", error: error },
      { status: 500 }
    );
  }
  await user.save();
  console.log("user created.", user);
  return NextResponse.json({ message: "user created.", user }, { status: 200 });
}
