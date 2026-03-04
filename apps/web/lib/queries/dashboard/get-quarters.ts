import { pool } from "@/lib/db";
import { Quarter } from "@repo/shared";
import type { PoolClient } from "pg";

export default async function getQuarters(companyId: string, year: number, client?: PoolClient): Promise<Quarter[]> {
  const database = client ?? pool;

  const result = await database.query(`
    SELECT DISTINCT 
      EXTRACT(QUARTER FROM date)::INTEGER AS quarter_num
    FROM (
      SELECT date FROM revenue 
      WHERE company_id = $1 AND EXTRACT(YEAR FROM date) = $2
      UNION ALL
      SELECT date FROM cogs 
      WHERE company_id = $1 AND EXTRACT(YEAR FROM date) = $2
      UNION ALL
      SELECT date FROM expenses 
      WHERE company_id = $1 AND EXTRACT(YEAR FROM date) = $2
    ) AS all_dates
    ORDER BY quarter_num;
  `, [companyId, year]);

  return result.rows.map(row => {
    const quarterNum = row.quarter_num;
    switch(quarterNum) {
      case 1: return 'q1';
      case 2: return 'q2';
      case 3: return 'q3';
      case 4: return 'q4';
      default: return 'q1';
    }
  });
}
