"use server";

import { UserModel } from "@/utils/backend/userModel";
import { TaskModel } from "@/utils/backend/taskModel";
import { connectDB } from "@/utils/backend/mongoDB";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ActionResponse } from "@/types/index";

async function getAuthenticatedUser() {
  const token = cookies().get("taskmastertoken")?.value;
  if (!token) return null;

  try {
    await connectDB();
    const verified = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as any;

    // Check if token is valid
    if (!verified || !verified.id) return null;

    const user = await UserModel.findById(verified.id);
    return user;
  } catch (error) {
    return null;
  }
}

export async function getTasks(token?: string): Promise<ActionResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const allTasks = await TaskModel.find({ user: user._id }).sort({
      createdAt: -1,
    });

    // Serialize for client
    const serializedTasks = allTasks.map((task) => ({
      _id: task._id.toString(),
      id: task._id.toString(), // Keep backwards compatibility if needed
      task: task.task,
      desc: task.desc,
      priority: task.priority,
      status: task.status,
      user: task.user.toString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return { success: true, data: serializedTasks };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTaskAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const task = formData.get("task") as string;
    const desc = formData.get("desc") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;

    if (!task || !desc || !priority || !status) {
      return { success: false, error: "Incomplete data" };
    }

    const newTask = await TaskModel.create({
      task,
      desc,
      priority,
      status,
      user: user._id,
    });

    revalidatePath("/");
    return { success: true, message: "Task created!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTaskAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;
    const taskTitle = formData.get("task") as string;
    const desc = formData.get("desc") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;

    const task = await TaskModel.findById(id);
    if (!task) return { success: false, error: "No task found" };

    if (task.user.toString() !== user._id.toString()) {
      return { success: false, error: "Not authorized" };
    }

    await TaskModel.findByIdAndUpdate(
      id,
      { task: taskTitle, desc, priority, status },
      { new: true },
    );

    revalidatePath("/");
    return { success: true, message: "Task updated!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTaskAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;

    const deletedTask = await TaskModel.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedTask) {
      return { success: false, error: "Task not found" };
    }

    revalidatePath("/");
    return { success: true, message: "Task Deleted!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
