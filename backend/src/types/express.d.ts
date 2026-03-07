import { Roles } from "./roles";

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: Roles;
      profile?: any;
    };
  }
}
