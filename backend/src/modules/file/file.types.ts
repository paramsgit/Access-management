export interface CreateFileDTO {
  fileName: string;
  fileType: string;
  fileUrl: string;
  ownerId: string;
}
export type Permissions = "READ" | "WRITE" | "DELETE";
