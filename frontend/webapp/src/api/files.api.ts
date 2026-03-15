import { api } from "./api";

export interface File {
  id: string;
  fileName: string;
  isPermission?: boolean;
  content?: { data: any };
}

export interface FileDetails extends File {}

export const getFiles = async () => {
  const res = await api.get("/files/all");
  return res.data;
};

export const getSingleFile = async (id: string, include: string = "") => {
  const res = await api.get(`/files/${id}?include=${include}`);
  return res.data;
};

export const updateFileContent = async (id: string, data: any) => {
  const res = await api.post(`/files/${id}/data`, { data });
  return res.data;
};
