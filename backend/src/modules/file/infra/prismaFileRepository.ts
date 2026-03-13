import { FileRepository } from "../domain/repositories/FileRepository";
import prisma from "../../../db/prisma";

export class PrismaFileRepository implements FileRepository {
  async findById(fileId: string) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        accesses: true,
      },
    });

    if (!file) return null;

    return {
      ...file,
      permissions: file.accesses.flatMap((a) => a.permissions),
    };
  }

  async update(fileId: string, data: any) {
    return prisma.file.update({
      where: { id: fileId },
      data,
    });
  }

  async delete(fileId: string) {
    await prisma.file.delete({ where: { id: fileId } });
  }

  async create(data) {
    return prisma.file.create({ data });
  }

  async grantPermission(fileId, userId, permission) {
    await prisma.fileAccess.upsert({
      where: {
        userId_fileId: {
          userId,
          fileId,
        },
      },
      update: {
        permissions: {
          push: permission,
        },
      },
      create: {
        userId,
        fileId,
        permissions: [permission],
      },
    });
  }

  async revokePermission(fileId, userId, permission) {
    const access = await prisma.fileAccess.findUnique({
      where: {
        userId_fileId: {
          userId,
          fileId,
        },
      },
    });

    if (!access) return;

    await prisma.fileAccess.update({
      where: { id: access.id },
      data: {
        permissions: access.permissions.filter((p) => p !== permission),
      },
    });
  }

  async getFilesWithPermission(
    userId: string,
    permission?: "READ" | "WRITE" | "DELETE",
  ) {
    // Get files owned by the user or shared with the user
    const files = await prisma.file.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            accesses: {
              some: {
                userId: userId,
                ...(permission && {
                  permissions: {
                    has: permission,
                  },
                }),
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        accesses: {
          where: {
            userId: userId,
          },
          select: {
            permissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      fileUrl: file.fileUrl,
      createdAt: file.createdAt,
      owner: file.owner,
      isOwned: file.ownerId === userId,
      permissions: file.accesses[0]?.permissions || [],
    }));
  }

  async getAllFilesWithPermissionStatus(
    userId: string,
    permission: "READ" | "WRITE" | "DELETE",
  ) {
    const files = await prisma.file.findMany({
      include: {
        accesses: {
          where: {
            userId: userId,
          },
          select: {
            permissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return files.map((file) => {
      const isPermission =
        file.accesses[0]?.permissions.includes(permission) ||
        file.ownerId === userId;
      return {
        id: file.id,
        fileName: file.fileName,
        isPermission,
      };
    });
  }
}
