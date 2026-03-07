import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const login = async (data: LoginPayload) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
