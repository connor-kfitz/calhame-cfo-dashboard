import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export async function getCogsByCompanyId(
  companyId: string,
  year: number,
  client?: PoolClient
) {
  const database = client ?? pool;

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await database.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_cogs
    FROM cogs
    WHERE company_id = $1
    AND date BETWEEN $2 AND $3;
  `, [companyId, startDate, endDate]);

  return result.rows[0].total_cogs;
}

