import { pool } from "../../../db";
import type { PoolClient } from "pg";

export default async function getProviderByDisplayName(displayName: string, client?: PoolClient) {
  const database = client ?? pool;

  const result = await database.query(`
    SELECT id FROM accounting_providers WHERE display_name = $1
  `, [displayName]);

  if (result.rowCount === 0) {
    throw new Error("Accounting provider not found");
  }

  return result.rows[0];
}
