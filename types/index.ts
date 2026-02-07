export interface ITask {
  _id: string;
  task: string;
  desc: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "Inactive";
  createdAt: string;
  updatedAt: string;
  user?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IUserContext {
  _id?: string;
  name: string | null;
  email: string | null;
  token: string | null;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  user?: IUserContext;
}
