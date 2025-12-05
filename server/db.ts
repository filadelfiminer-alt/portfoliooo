import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

function createPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  
  const isProduction = process.env.NODE_ENV === "production";
  
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
}

export const pool = createPool();
export const db = pool ? drizzle(pool, { schema }) : null;
