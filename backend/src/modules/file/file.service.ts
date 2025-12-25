import prisma from "../../db/prisma";
import { CreateFileDTO } from "./file.types";

export class FileService {
  static async createFile(data: CreateFileDTO) {
    return prisma.file.create({
      data,
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileUrl: true,
        createdAt: true,
      },
    });
  }

  static async getFilesByUser(userId: string) {
    return prisma.file.findMany({
      where: { userId },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllFiles() {
    return prisma.file.findMany({
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
