import { api } from "./api";

export interface File {
  id: string;
  fileName: string;
  isPermission?: boolean;
}

export interface FileDetails extends File {}

export const getFiles = async () => {
  const res = await api.get("/files/all");
  return res.data;
};

export const getSingleFile = async (id: string) => {
  const res = await api.get(`/files/all/${id}`);
  return res.data;
};
