import type { Variable, Environment, User } from '$lib/types';
import pool from '.';

export class VariableDAO {
	static convertToVariable(row: Record<string, never>): Variable {
		return {
			id: row.id,
			name: row.name,
			value: row.value,
			createdAt: row.created_at,
			environmentId: row.environment_id
		};
	}

	static async createVariable(
		environmentId: Environment['id'],
		name: Variable['name'],
		value: Variable['value']
	): Promise<Variable> {
		if (!environmentId) {
			throw new Error('Environment ID is required');
		}
		if (!name) {
			throw new Error('Variable name is required');
		}
		if (!value) {
			throw new Error('Variable value is required');
		}
		const result = await pool.query(
			`INSERT INTO variables (environment_id, name, value)
      VALUES ($1, $2, $3)
      ON CONFLICT (environment_id, name)
      DO UPDATE SET value = EXCLUDED.value
      RETURNING *`,
			[environmentId, name, value]
		);
		return VariableDAO.convertToVariable(result.rows[0]);
	}

	static async getVariablesByEnvironment(
		userId: User['id'],
		environmentId: Environment['id']
	): Promise<Variable[]> {
		const result = await pool.query(
			'SELECT * FROM variables WHERE environment_id = $1 AND environment_id IN (SELECT id FROM environments WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = $2)) ORDER BY created_at DESC',
			[environmentId, userId]
		);
		return result.rows.map(VariableDAO.convertToVariable);
	}

	static async deleteVariable(userId: User['id'], variableId: Variable['id']): Promise<void> {
		await pool.query(
			'DELETE FROM variables WHERE id = $1 AND environment_id IN (SELECT id FROM environments WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = $2))',
			[variableId, userId]
		);
	}

	static async editVariable(
		userId: User['id'],
		variableId: Variable['id'],
		name: Variable['name'],
		value: Variable['value']
	): Promise<Variable> {
		const result = await pool.query(
			'UPDATE variables SET name = $1, value = $2 WHERE id = $3 AND environment_id IN (SELECT id FROM environments WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = $4)) RETURNING *',
			[name, value, variableId, userId]
		);
		return VariableDAO.convertToVariable(result.rows[0]);
	}
}
