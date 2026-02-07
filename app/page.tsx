import BG from "@/components/BG/BG";
import Table from "@/components/Table/Table";
import { getTasks } from "@/app/actions/task";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = cookies().get("taskmastertoken")?.value;

  if (!token) {
    redirect("/login");
  }

  const tasksRes = await getTasks(token);
  const tasks = tasksRes.success ? tasksRes.data : [];

  return (
    <div className="overflow-clip max-h-screen relative">
      <div className="absolute z-0 overflow-hidden">
        <BG />
      </div>
      <Table initialTasks={tasks || []} />
    </div>
  );
}
