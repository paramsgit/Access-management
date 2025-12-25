import { Policy } from "../auth/policy";
import { Action } from "../auth/action";
import { FileAccessEntity } from "./FileAccessEntity";

export class FilePolicy implements Policy<FileAccessEntity> {
  can(user, file, action: Action): boolean {
    if (user.role === "ADMIN") return true;
    if (file?.ownerId === user.id) return true;

    switch (action) {
      case Action.READ_FILE:
        return file.permissions.includes("READ");
      case Action.UPDATE_FILE:
        return file.permissions.includes("WRITE");
      case Action.DELETE_FILE:
        return file.permissions.includes("DELETE");
      case Action.CREATE_FILE:
        return !!user; // any logged-in user
      case Action.GRANT_PERMISSION:
      case Action.REVOKE_PERMISSION:
        return user.role === "ADMIN" || file.ownerId === user.id;

      default:
        return false;
    }
  }
}
