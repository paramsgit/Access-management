import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/users");
  return res.data;
};
