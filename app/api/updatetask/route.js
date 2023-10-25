import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers'
import { TaskModel } from "@/utils/backend/taskModel";

export async function PUT(req, res) {
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
    const data = await req.json();
    
    await connectDB();
    const token=taskmastertoken;
    const verified = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    if(!verified)
    {
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
   
      const task= await TaskModel.findById(data.id);
      
      if(!task)
      {
        return new NextResponse(
            JSON.stringify({
            success: false,
            error: "No task found",
            }),
            {
            status: 400,
            }
        );
      }

      if(task.user.toString()!==user._id.toString())
        {
            return new NextResponse(
                JSON.stringify({
                success: false,
                error: "Not authorized",
                }),
                {
                status: 400,
                }
            );
        }
      const updatedtask = await TaskModel.findByIdAndUpdate(data.id,data, {new: true});
      

     
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Task updated !",
        data:updatedtask
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
