import { FileRepository } from "../domain/repositories/FileRepository";
import { Action } from "../domain/auth/action";
import { fileAuthorizationService } from "../domain/auth/auth.bootstrap";

export class UpdateFileUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(user, fileId: string, data: any) {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw new Error("File not found");

    fileAuthorizationService.authorize("file", user, file, Action.UPDATE_FILE);

    return this.fileRepo.update(fileId, data);
  }
}
