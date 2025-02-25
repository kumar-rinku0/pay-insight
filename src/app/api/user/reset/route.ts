import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user";
import connection from "@/lib/conection";
import { createMailSystem } from "@/util/mail";
import bcrypt from "bcryptjs";

connection();

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Incorrect email.", status: 400 });
  }
  createMailSystem({ address: email, type: "reset", _id: user._id });
  return NextResponse.json({ message: "mail sent.", status: 200 });
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const TOKEN = searchParams.get("TOKEN");
    const { password, confirmPassword } = await req.json();
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Incorrect password.", status: 400 });
    }
    const user = await User.findOne({ resetToken: TOKEN });
    if (!user) {
      return NextResponse.json({ message: "Invalid Token!", status: 401 });
    }
    if (user && user.resetTokenExpire < Date.now()) {
      return NextResponse.json({ message: "Token has expired.", status: 401 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const res = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetToken: null,
      },
      { new: true }
    );
    return NextResponse.json({
      message: "Password updated!",
      status: 200,
      user: res,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error.",
      status: 500,
    });
  }
}
