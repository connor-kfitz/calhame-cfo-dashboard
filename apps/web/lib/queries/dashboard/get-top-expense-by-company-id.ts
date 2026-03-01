import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export async function getTopExpense(
  companyId: string,
  year: number,
  client?: PoolClient
) {
  const database = client ?? pool;

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await database.query(`
    SELECT
      category,
      SUM(amount) AS total
    FROM expenses
    WHERE company_id = $1
    AND date BETWEEN $2 AND $3
    GROUP BY category
    ORDER BY total DESC
    LIMIT 1;
  `, [companyId, startDate, endDate]
  );

  return result.rows[0];
}
