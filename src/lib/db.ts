import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@db:5432/chaldb`,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
