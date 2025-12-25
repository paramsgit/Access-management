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
}
