import { FileRepository } from "../domain/repositories/FileRepository";

export class GetAllFilesWithPermissionStatusUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(
    userId: string,
    permission: "READ" | "WRITE" | "DELETE",
  ) {
    return this.fileRepo.getAllFilesWithPermissionStatus(userId, permission);
  }
}
