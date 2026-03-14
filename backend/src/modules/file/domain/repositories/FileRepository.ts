import { User } from "../../../../generated/prisma/client";
import { FileAccessEntity, FileData } from "../file/FileAccessEntity";

export interface FileRepository {
  findById(fileId: string): Promise<FileAccessEntity | null>;
  update(fileId: string, data: any): Promise<any>;
  delete(fileId: string): Promise<void>;
  getFileData(fileId: string): Promise<FileData | null>;
  updateFileContent(fileId: string, data: any): Promise<any>;
  create(data: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    ownerId: string;
    owner?: User;
  }): Promise<any>;

  grantPermission(
    fileId: string,
    targetUserId: string,
    permission: "READ" | "WRITE" | "DELETE",
  ): Promise<void>;

  revokePermission(
    fileId: string,
    targetUserId: string,
    permission: "READ" | "WRITE" | "DELETE",
  ): Promise<void>;

  getFilesWithPermission(
    userId: string,
    permission?: "READ" | "WRITE" | "DELETE",
  ): Promise<any[]>;

  getAllFilesWithPermissionStatus(
    userId: string,
    permission: "READ" | "WRITE" | "DELETE",
  ): Promise<any[]>;
}
