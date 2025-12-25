import { FileRepository } from "../domain/repositories/FileRepository";
import { Action } from "../domain/auth/action";
import { fileAuthorizationService } from "../domain/auth/auth.bootstrap";

export class CreateFileUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(
    user,
    input: {
      fileName: string;
      fileType: string;
      fileUrl: string;
    }
  ) {
    // Authorization (optional but future-proof)
    fileAuthorizationService.authorize("file", user, null, Action.CREATE_FILE);
    return this.fileRepo.create({
      ...input,
      ownerId: user.id,
    });
  }
}
