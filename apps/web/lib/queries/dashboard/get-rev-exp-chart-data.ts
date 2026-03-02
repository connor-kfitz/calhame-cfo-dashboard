import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function getRevenueExpenseChartData(
  companyId: string,
  year: number,
  client?: PoolClient
) {
  const database = client ?? pool;

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await database.query(`
    WITH months AS (
      SELECT DATE_TRUNC('month', d) AS month
      FROM generate_series(
        DATE_TRUNC('month', $2::date),
        DATE_TRUNC('month', $3::date),
        interval '1 month'
      ) AS d
    ),
    agg AS (
      SELECT
        DATE_TRUNC('month', COALESCE(r.date, e.date)) AS month,
        SUM(r.amount) AS revenue,
        SUM(e.amount) AS opex
      FROM revenue r
      FULL OUTER JOIN expenses e
        ON DATE_TRUNC('month', r.date) = DATE_TRUNC('month', e.date)
      WHERE (
        r.company_id = $1 AND r.date BETWEEN $2 AND $3
      )
      OR (
        e.company_id = $1 AND e.date BETWEEN $2 AND $3
      )
      GROUP BY 1
    )
    SELECT
      EXTRACT(MONTH FROM m.month) AS month,
      a.revenue,
      a.opex
    FROM months m
    LEFT JOIN agg a ON m.month = a.month
    ORDER BY m.month;
  `, [companyId, startDate, endDate]);

  return result.rows;
}
