import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function deleteCompanyMembershipsById(companyMembershipId: string, userId: string, client?: PoolClient) {
  const database = client ?? pool;

  const result = await database.query(`
    DELETE FROM company_memberships
    WHERE id = $1 AND user_id = $2
    RETURNING id AS "companyMembershipId"
  `, [companyMembershipId, userId]);

  if (result.rowCount === 0) {
    throw new Error("Company membership not found or user not authorized to delete");
  }
  
  return result.rows[0];
}
