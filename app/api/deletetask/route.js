import { NextResponse } from "next/server";
import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers'
import { TaskModel } from "@/utils/backend/taskModel";

export async function DELETE(req, res) {
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
    const { id } = await req.json();
    if (!id)
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
      
    //   const deletedTask= await TaskModel.findByIdAndDelete(id)
    // delete a task where _id = id and user = user._id
    const deletedTask= await TaskModel.findOneAndDelete({_id:id,user:user._id})
    if(!deletedTask)
    {
        return new NextResponse(
            JSON.stringify({
            success: false,
            error: "Task not found",
            }),
            {
            status: 400,
            }
        );
    }

     
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Task Deleted!",
        data:deletedTask
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
