# File Access Management

This module implements **secure and scalable access management** for files using **Clean Architecture** and **policy-based authorization**.

The focus of this design is to clearly separate **who a user is** from **what a user is allowed to do**, while keeping permission rules easy to change and extend.

---

## Core Idea

Access decisions are made by answering one question:

> **Can this user perform this action on this resource?**

This decision is handled centrally by a **policy system**, not scattered across controllers or middleware.

---

## Authentication vs Authorization

### Authentication

- Verifies user identity
- Happens once per request
- Attaches minimal user info (`id`, `role`) to the request

### Authorization

- Determines whether an action is allowed
- Happens inside use cases
- Uses policies to enforce rules

These two concerns are intentionally kept separate.

---

## Access Decision Flow

1. A request reaches the system
2. The user is authenticated and identified
3. The controller forwards the request to a use case
4. The use case requests an authorization decision
5. The authorization service selects the correct policy
6. The policy evaluates access rules
7. The action is allowed or denied

This ensures every access decision follows the same controlled path.

---

## Policy-Based Authorization

Each resource (such as a file) has a dedicated **policy** that defines all access rules for that resource.

Policies:

- Encapsulate authorization logic
- Are interchangeable and extensible
- Act as strategies selected at runtime

This follows the **Strategy Pattern**, allowing new resource rules to be added without modifying existing logic.

---

## Ownership and Permissions Model

Access is granted based on three layers of checks:

1. **Admin override** – administrators can perform all actions
2. **Ownership** – the creator of a file has full access
3. **Explicit permissions** – shared users have limited access

Explicit permissions include:

- Read
- Write
- Delete

---

## Permission Assignment Logic

- Only the file owner or an administrator can grant or revoke permissions
- Permissions are assigned per user per file
- Permission changes do not affect ownership

This allows flexible sharing while maintaining strong access boundaries.

---

## Clean Architecture Principles Applied

- Domain rules are isolated from frameworks and databases
- Controllers contain no business or permission logic
- Use cases orchestrate operations and request authorization
- Policies are the single source of truth for access rules

This makes the system easy to test, refactor, and scale.

---

## Scalability and Extensibility

This design allows:

- Adding new permissions without touching controllers
- Supporting new resources with their own policies
- Introducing advanced rules like time-based or role-based access

The authorization system grows by extension, not modification.

---

## TODO

- Add request body input validation
- Add permission expiry support
- Add audit logging for permission changes
- Add folder or group-based access
- Add comprehensive unit tests for policies

---
