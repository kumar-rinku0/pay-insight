import { NextResponse } from "next/server";
import User from "@/model/user";
// import { setUser } from "@/util/jwt";
import connection from "@/lib/conection";
import { createMailSystem } from "@/util/mail";

connection();

export async function POST(req: Request) {
  const info = await req.json();
  console.log(info);
  const userbyusername = await User.findOne({
    username: info.username,
  });
  if (userbyusername) {
    return NextResponse.json(
      {
        message: "user already exist, try another username!",
        user: userbyusername,
      },
      { status: 400 }
    );
  }
  const userbyemail = await User.findOne({
    email: info.email,
  });
  if (userbyemail) {
    return NextResponse.json(
      {
        message: "user already exist!",
        error:
          "email alrady exist, in case you forget your password, try to reset it.",
        user: userbyemail,
      },
      { status: 400 }
    );
  }
  const user = new User(info);
  try {
    await user.save();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "user not created.", error: error },
      { status: 500 }
    );
  }
  console.log("user created.", user);
  createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  })
    .then(() => {
      console.log("mail sent.");
    })
    .catch((error) => {
      console.error(error);
    });
  const response = NextResponse.json(
    {
      message: "mail sent. verify mail address!",
    },
    { status: 200 }
  );
  // const jwtToken = setUser({ user });
  // response.cookies.set({
  //   name: "JWT_TOKEN",
  //   value: jwtToken,
  //   path: "/",
  // });
  return response;
}
