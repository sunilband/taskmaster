import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'


export async function POST(req, res) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Incomplete data",
        }),
        {
          status: 400,
        }
      );

    await connectDB();
    
    let user = await UserModel.findOne({ email }).select("+password");
    let decryptedPass=bcrypt.compareSync(password.toString(),user.password);
   
    if (!user || !decryptedPass)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Invalid credentials",
        }),
        {
          status: 400,
        }
      );
    
    const token = jwt.sign({ id: user._id }, process.env.NEXT_PUBLIC_JWT_SECRET);
    // const verified = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    cookies().set({
      name: 'taskmastertoken',
      value: token,
      // httpOnly: true,
      path: '/',
      maxAge:15*24*60*60*1000
    })

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Welcome back "+user.name+" ! ",
        user:{
          name:user.name,
          email:user.email,
          // token:token
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
