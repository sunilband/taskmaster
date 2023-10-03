"use client"
import { createContext, useContext, useState } from "react";

interface taskInterface {
    task: string;
    desc: string;
    priority: string;
    status: string;
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface Tasks{
 tasks: taskInterface[];
 setTasks: (tasks: taskInterface[]) => void;
}

const TaskContext = createContext<Tasks>({
  tasks: [],
  setTasks: () => {},
});

export const TaskProvider = ({ children }:any) => {
const [tasks, setTasks] = useState<taskInterface[]>([]);

    return (
        <TaskContext.Provider value={{ tasks, setTasks }}>
        {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext= () => useContext(TaskContext);