import type { Project, User } from '$lib/types';
import pool from '.';

export class ProjectMembersDAO {
	static async addMember(
		projectId: Project['id'],
		userId: User['id'],
		role: 'owner' | 'guest'
	): Promise<void> {
		await pool.query(
			'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = EXCLUDED.role',
			[projectId, userId, role]
		);
	}

	static async removeMember(projectId: Project['id'], userId: User['id']): Promise<void> {
		await pool.query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [
			projectId,
			userId
		]);
	}

	static async getMembers(
		projectId: Project['id']
	): Promise<{ userId: User['id']; role: 'owner' | 'guest' }[]> {
		const result = await pool.query(
			'SELECT user_id, role FROM project_members WHERE project_id = $1',
			[projectId]
		);
		return result.rows;
	}

	static async getUserProjects(userId: User['id']): Promise<Project[]> {
		const result = await pool.query(
			'SELECT p.* FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = $1',
			[userId]
		);
		return result.rows;
	}

	static async getUserRole(
		projectId: Project['id'],
		userId: User['id']
	): Promise<'owner' | 'guest' | null> {
		const result = await pool.query(
			'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
			[projectId, userId]
		);
		return result.rows.length > 0 ? result.rows[0].role : null;
	}
}
