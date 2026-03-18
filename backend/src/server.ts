import app from "./app";
import prisma from "./db/prisma";

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to database
async function startServer() {
  try {
    // Test database connection
    const databaseUrl = process.env.DATABASE_URL;
    console.log(`[database] URL: ${databaseUrl}`);

    await prisma.$connect();
    console.log(`[database] ✓ Connected to database successfully`);

    app.listen(Number(PORT), () => {
      console.log(`[boot] server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[database] ✗ Failed to connect to database:`, error);
    process.exit(1);
  }
}

startServer();
