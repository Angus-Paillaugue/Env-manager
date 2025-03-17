import type { Environment, Project, User } from '$lib/types';
import pool from '.';
import { VariableDAO } from './variable';

export class EnvironmentDAO {
	static transformEnvironment(row: Record<string, never>): Environment {
		return {
			id: row.id,
			projectId: row.project_id,
			name: row.name,
			createdAt: row.created_at,
			variables: []
		};
	}

	static async getEnvironmentByName(
		userId: User['id'],
		projectId: Project['id'],
		name: Environment['name']
	): Promise<Environment | null> {
		const result = await pool.query(
			'SELECT * FROM environments WHERE project_id = $1 AND name = $2 AND EXISTS (SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $3)',
			[projectId, name, userId]
		);
		if (result.rows.length === 0) return null;
		const environment = EnvironmentDAO.transformEnvironment(result.rows[0]);
		environment.variables = await VariableDAO.getVariablesByEnvironment(userId, environment.id);
		return environment;
	}

	static async getEnvironmentsByProjectId(
		userId: User['id'],
		projectId: Project['id']
	): Promise<Environment[]> {
		const environmentsQuery = await pool.query(
			'SELECT * FROM environments, project_members WHERE environments.project_id = $1 AND environments.project_id = project_members.project_id AND project_members.user_id = $2 ORDER BY created_at DESC',
			[projectId, userId]
		);
		return environmentsQuery.rows.map(EnvironmentDAO.transformEnvironment);
	}

	static async createEnvironment(
		projectId: Project['id'],
		name: Environment['name']
	): Promise<Environment> {
		name = name.trim();
		if (name === '') throw new Error('Environment name cannot be empty');
		const alreadyExists = await pool.query(
			'SELECT 1 FROM environments WHERE project_id = $1 AND name = $2',
			[projectId, name]
		);
		if (alreadyExists.rows.length > 0) throw new Error('Environment "' + name + '" already exists');
		const result = await pool.query(
			'INSERT INTO environments (project_id, name) VALUES ($1, $2) RETURNING *',
			[projectId, name]
		);
		return EnvironmentDAO.transformEnvironment(result.rows[0]);
	}

	static async deleteEnvironment(
		userId: User['id'],
		environmentId: Environment['id']
	): Promise<void> {
		await pool.query(
			'DELETE FROM environments WHERE id = $1 AND EXISTS (SELECT 1 FROM project_members WHERE project_id = (SELECT project_id FROM environments WHERE id = $1) AND user_id = $2)',
			[environmentId, userId]
		);
	}

	static async getEnvironmentById(
		userId: User['id'],
		environmentId: Environment['id']
	): Promise<Environment | null> {
		const result = await pool.query(
			'SELECT * FROM environments WHERE id = $1 AND EXISTS (SELECT 1 FROM project_members WHERE project_id = (SELECT project_id FROM environments WHERE id = $1) AND user_id = $2)',
			[environmentId, userId]
		);
		if (result.rows.length === 0) return null;
		const environment = EnvironmentDAO.transformEnvironment(result.rows[0]);
		environment.variables = await VariableDAO.getVariablesByEnvironment(userId, environment.id);
		return environment;
	}

	static async editEnvironment(
		userId: User['id'],
		environmentId: Environment['id'],
		environment: Environment
	): Promise<Environment> {
		const result = await pool.query(
			'UPDATE environments SET name = $1 WHERE id = $2 AND EXISTS (SELECT 1 FROM project_members WHERE project_id = (SELECT project_id FROM environments WHERE id = $2) AND user_id = $3) RETURNING *',
			[environment.name, environmentId, userId]
		);
		return EnvironmentDAO.transformEnvironment(result.rows[0]);
	}
}
