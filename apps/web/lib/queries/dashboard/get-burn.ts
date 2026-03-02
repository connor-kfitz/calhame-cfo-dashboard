import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function getBurn(
  companyId: string,
  year: number,
  client?: PoolClient
) {
  const database = client ?? pool;

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await database.query(`
    SELECT
      DATE_TRUNC('month', date) AS month,
      SUM(amount) AS monthly_opex
    FROM expenses
    WHERE company_id = $1
    AND date BETWEEN $2 AND $3
    GROUP BY 1
    ORDER BY 1;
  `, [companyId, startDate, endDate]);

  return result.rows[0].monthly_opex;
}
