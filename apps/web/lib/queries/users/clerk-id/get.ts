import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function getUserByClerkId(clerkId: string, client?: PoolClient) {
  const database = client ?? pool;

  const result = await database.query(`
    SELECT id FROM users WHERE clerk_id = $1
  `, [clerkId]);

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
  
  return result.rows[0];
}
