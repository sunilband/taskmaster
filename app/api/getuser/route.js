import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req, res) {
  try {
    const { taskmastertoken } = await req.json();

    if (!taskmastertoken)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "no token provided",
        }),
        {
          status: 400,
        }
      );

    await connectDB();
    const token=taskmastertoken;
    const verified = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    let user = await UserModel.findById(verified.id);

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "no user found",
        }),
        {
          status: 400,
        }
      );

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Welcome back " + user.name + "! ",
        user: {
          name: user.name,
          email: user.email,
          token: token,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message.toString(),
      }),
      {
        status: 500,
      }
    );
  }
}
