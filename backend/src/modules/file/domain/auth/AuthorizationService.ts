import { Action, AuthUser } from "./action";
import { Policy } from "./policy";

// domain/auth/AuthorizationService.ts
export class AuthorizationService {
  private policies = new Map<string, Policy<any>>();

  register(resource: string, policy: Policy<any>) {
    this.policies.set(resource, policy);
  }

  authorize<T>(resource: string, user: AuthUser, entity: T, action: Action) {
    const policy = this.policies.get(resource);

    if (!policy) {
      throw new Error(`No policy for ${resource}`);
    }

    if (!policy.can(user, entity, action)) {
      throw new Error("Forbidden");
    }
  }
}
