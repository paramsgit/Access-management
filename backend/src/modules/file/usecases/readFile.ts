import { FileRepository } from "../domain/repositories/FileRepository";
import { Action } from "../domain/auth/action";
import { fileAuthorizationService } from "../domain/auth/auth.bootstrap";

export class ReadFileUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(user, fileId: string) {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw new Error("File not found");

    fileAuthorizationService.authorize("file", user, file, Action.READ_FILE);

    return file;
  }
}
