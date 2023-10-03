import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers'
import { TaskModel } from "@/utils/backend/taskModel";

export async function GET(req, res) {
  try {

  const headersInstance = headers()
  const taskmastertoken = headersInstance.get('authorization').split('Bearer ')[1]

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
    if(!verified)
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Invalid token",
      }),
      {
        status: 400,
      }
    );

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

      const allTasks= await TaskModel.find({user:user._id})
     
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Tasks fetched !",
        data:allTasks
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
