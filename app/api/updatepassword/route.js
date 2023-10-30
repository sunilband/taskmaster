import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req, res) {
  try {
    const { verifyToken, password } = await req.json();
    const { _id } = jwt.verify(verifyToken, process.env.NEXT_PUBLIC_JWT_SECRET);

    if (!_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Invalid token",
        }),
        {
          status: 400,
        }
      );
    }

    await connectDB();
    let hashedPassword = await bcrypt.hash(password.toString(), 10);
    let user = await UserModel.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true }
    );

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
        message: "Password Updated!",
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
