import { Pool } from "pg";

type User = { id: number; email: string; name: string };

const connectionString =
  process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

if (!connectionString) {
  // Defer throwing until called so the app can still start for non-DB endpoints.
  console.warn(
    "Warning: DATABASE_URL / PG_CONNECTION_STRING not set. DB calls will fail until you set a valid Postgres connection string."
  );
}

const pool = new Pool({ connectionString });

export const getUsers = async (): Promise<User[]> => {
  if (!connectionString) throw new Error("DATABASE_URL not configured");
  const res = await pool.query<{ id: number; email: string; name: string }>(
    "SELECT id, email, name FROM users ORDER BY id"
  );
  return res.rows.map((r) => ({
    id: Number(r.id),
    email: r.email,
    name: r.name,
  }));
};

export const getUser = async (id: number): Promise<User | undefined> => {
  if (!connectionString) throw new Error("DATABASE_URL not configured");
  const res = await pool.query<{ id: number; email: string; name: string }>(
    "SELECT id, email, name FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  const row = res.rows[0];
  if (!row) return undefined;
  return { id: Number(row.id), email: row.email, name: row.name };
};

export const createUser = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<User> => {
  if (!connectionString) throw new Error("DATABASE_URL not configured");
  try {
    const res = await pool.query<{ id: number; email: string; name: string }>(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name",
      [email, name]
    );
    const row = res.rows[0];
    return { id: Number(row.id), email: row.email, name: row.name };
  } catch (err: any) {
    // Convert Postgres duplicate key error into the same error message the original code expected
    if (err?.code === "23505") {
      const e = new Error("duplicate key: email");
      // keep original PG error on the object for debugging
      (e as any).original = err;
      throw e;
    }
    throw err;
  }
};

// Export pool for manual migrations / tests if needed
export { pool };
