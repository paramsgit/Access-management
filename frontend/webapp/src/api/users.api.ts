import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};
