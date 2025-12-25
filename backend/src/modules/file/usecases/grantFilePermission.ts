import { FileRepository } from "../domain/repositories/FileRepository";
import { Action } from "../domain/auth/action";
import { fileAuthorizationService } from "../domain/auth/auth.bootstrap";

export class GrantFilePermissionUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(
    user,
    fileId: string,
    targetUserId: string,
    permission: "READ" | "WRITE" | "DELETE"
  ) {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw new Error("File not found");

    fileAuthorizationService.authorize(
      "file",
      user,
      file,
      Action.GRANT_PERMISSION
    );

    await this.fileRepo.grantPermission(fileId, targetUserId, permission);

    return { success: true };
  }
}
