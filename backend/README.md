
# traditional-node-errors

A purposely *messy* Node.js + Express project with traditional error handling (inconsistent payloads, lots of `try/catch`, occasional `next(err)`, and leaking stack traces in non-prod). Use this as a starting point to refactor into a robust error architecture.

## Quick start
```bash
npm i
npm start
# server on http://localhost:3000
```

## Endpoints
- `GET /health` — simple health check
- `GET /users` — list users (may simulate a DB error with query `?failDb=true`)
- `GET /users/:id` — get one user (404 handling is inconsistent)
- `POST /users` — create user (basic validation with ad-hoc responses)
- `GET /external/posts` — calls JSONPlaceholder; may timeout or error

## Notes (anti-patterns to look for)
- Inconsistent JSON error shapes (`{error:""}`, `{message:""}`, raw strings).
- Sometimes `next(err)`, other times `res.status(500).json(...)` directly.
- Validation mixed with controller logic.
- Stack traces leak when `NODE_ENV !== 'production'`.
- No correlation/trace id; console logs only.
