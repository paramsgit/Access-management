import { PrismaFileRepository } from "./infra/prismaFileRepository";

import { CreateFileUseCase } from "./usecases/createFile";
import { ReadFileUseCase } from "./usecases/readFile";
import { UpdateFileUseCase } from "./usecases/updateFile";
import { DeleteFileUseCase } from "./usecases/deleteFile";
import { GrantFilePermissionUseCase } from "./usecases/grantFilePermission";
import { RevokeFilePermissionUseCase } from "./usecases/revokePermission";

const fileRepository = new PrismaFileRepository();

export const createFileUseCase = new CreateFileUseCase(fileRepository);
export const readFileUseCase = new ReadFileUseCase(fileRepository);
export const updateFileUseCase = new UpdateFileUseCase(fileRepository);
export const deleteFileUseCase = new DeleteFileUseCase(fileRepository);
export const grantFilePermissionUseCase = new GrantFilePermissionUseCase(
  fileRepository
);
export const revokeFilePermissionUseCase = new RevokeFilePermissionUseCase(
  fileRepository
);
