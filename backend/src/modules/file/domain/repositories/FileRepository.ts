import { User } from "../../../../generated/prisma/client";
import { FileAccessEntity } from "../file/FileAccessEntity";

export interface FileRepository {
  findById(fileId: string): Promise<FileAccessEntity | null>;
  update(fileId: string, data: any): Promise<any>;
  delete(fileId: string): Promise<void>;
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
    permission: "READ" | "WRITE" | "DELETE"
  ): Promise<void>;

  revokePermission(
    fileId: string,
    targetUserId: string,
    permission: "READ" | "WRITE" | "DELETE"
  ): Promise<void>;
}
