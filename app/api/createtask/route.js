import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers'
import { TaskModel } from "@/utils/backend/taskModel";

export async function POST(req, res) {
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
    const { task,desc,priority,status } = await req.json();
    if (!task || !desc || !priority || !status)
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

      const newTask= await TaskModel.create({
        task:task,
        desc:desc,
        priority:priority,
        status:status,
        user:user._id
      })

     
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Task created!",
        data:newTask
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
