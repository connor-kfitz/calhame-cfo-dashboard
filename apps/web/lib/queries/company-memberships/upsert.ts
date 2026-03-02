import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

export default async function upsertCompanyMembership(userId: string, companyId: string, role: string = "member", client?: PoolClient) {
	const database = client ?? pool;

	const result = await database.query(`
		INSERT INTO company_memberships (user_id, company_id, role, created_at)
		VALUES ($1, $2, $3, NOW())
		ON CONFLICT (user_id, company_id)
		DO UPDATE SET
			role = EXCLUDED.role
		RETURNING *
	`, [userId, companyId, role]);

	if (result.rowCount === 0) {
		throw new Error("Failed to upsert company membership");
	}

	return result.rows[0];
}
