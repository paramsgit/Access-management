// domain/auth/Action.ts
export enum Action {
  CREATE_FILE = "CREATE_FILE",
  READ_FILE = "READ_FILE",
  UPDATE_FILE = "UPDATE_FILE",
  DELETE_FILE = "DELETE_FILE",
  GRANT_PERMISSION = "GRANT_PERMISSION",
  REVOKE_PERMISSION = "REVOKE_PERMISSION",
}

export type AuthUser = {
  id: string;
  role: "ADMIN" | "USER";
  email?: string;
};
