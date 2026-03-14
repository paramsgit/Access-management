import { z } from "zod";

export const createFileSchema = z.object({
  body: z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    fileUrl: z.string(),
  }),
});

export const updateFileSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    fileName: z.string().optional(),
    fileType: z.string().optional(),
    fileUrl: z.string().url().optional(),
  }),
});

export const updateFileContent = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    data: z.looseObject({}),
  }),
});
