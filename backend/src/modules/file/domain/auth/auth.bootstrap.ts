import { AuthorizationService } from "./AuthorizationService";
import { FilePolicy } from "../file/FilePolicy";

export const fileAuthorizationService = new AuthorizationService();

fileAuthorizationService.register("file", new FilePolicy());
