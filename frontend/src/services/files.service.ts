import { api } from "@/lib/api";

export interface File {
  id: string;
  name: string;
  link: string;
}

export const getFiles = async (): Promise<File[]> => {
  const res = await api.get<File[]>("/files");
  return res.data;
};
