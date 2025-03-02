import { NextResponse } from "next/server";
import User from "@/model/user";
// import { setUser } from "@/util/jwt";
import connection from "@/lib/conection";
import { createMailSystem } from "@/util/mail";

connection();

export async function POST(req: Request) {
  const info = await req.json();
  console.log(info);
  const userbyemail = await User.findOne({
    email: info.email.trim(),
  });
  if (userbyemail) {
    return NextResponse.json(
      {
        message: "user already exist! with this email.",
        error:
          "email alrady exist, in case you forget your password, try to reset it.",
        user: userbyemail,
      },
      { status: 400 }
    );
  }

  const user = new User({
    givenName: info.givenName.trim(),
    familyName: info.familyName.trim(),
    email: info.email.trim(),
    password: info.password.trim(),
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
  return response;
}
