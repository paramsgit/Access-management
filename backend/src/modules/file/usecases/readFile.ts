import { FileRepository } from "../domain/repositories/FileRepository";
import { Action } from "../domain/auth/action";
import { fileAuthorizationService } from "../domain/auth/auth.bootstrap";
import { ParsedQs } from "qs";

export class ReadFileUseCase {
  constructor(private fileRepo: FileRepository) {}

  async execute(user, fileId: string, query?: ParsedQs) {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw new Error("File not found");

    fileAuthorizationService.authorize("file", user, file, Action.READ_FILE);

    if (query?.include) {
      let includeContent = false;
      if (typeof query.include === "string") {
        includeContent = query.include?.includes("content");
      } else if (Array.isArray(query.include)) {
        includeContent = query.include.includes("content");
      }
      if (includeContent) {
        const fileContent = await this.fileRepo.getFileData(fileId);
        file.content = fileContent?.content;
      }
    }

    return file;
  }
}
