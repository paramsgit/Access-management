import { FileRepository } from "../domain/repositories/FileRepository";

export class GetFilesWithPermissionUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(userId: string, permission?: "READ" | "WRITE" | "DELETE") {
    return this.fileRepo.getFilesWithPermission(userId, permission);
  }
}
