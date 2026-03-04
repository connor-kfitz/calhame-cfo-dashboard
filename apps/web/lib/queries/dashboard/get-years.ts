import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function getYears(companyId: string, client?: PoolClient): Promise<number[]> {
  const database = client ?? pool;

  const result = await database.query(`
    SELECT DISTINCT EXTRACT(YEAR FROM date)::INTEGER AS year
    FROM (
      SELECT date FROM revenue WHERE company_id = $1
      UNION ALL
      SELECT date FROM cogs WHERE company_id = $1
      UNION ALL
      SELECT date FROM expenses WHERE company_id = $1
    ) AS all_dates
    ORDER BY year DESC;
  `, [companyId]);

  return result.rows.map(row => row.year);
}
