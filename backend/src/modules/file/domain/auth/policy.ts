import { Action, AuthUser } from "./action";

// domain/auth/Policy.ts
export interface Policy<T> {
  can(user: AuthUser, resource: T, action: Action): boolean;
}
