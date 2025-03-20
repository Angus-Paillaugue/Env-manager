import type { Project, ProjectMember, User } from '$lib/types';
import pool from '.';
import { ProjectDAO } from './project';
import { UserDAO } from './user';

export class ProjectMembersDAO {
	static transformProjectMember(row: Record<string, never>): ProjectMember {
		return {
			userId: row.user_id,
			projectId: row.project_id,
			role: row.role,
			user: UserDAO.convertToUser(row)
		};
	}

	static async addMember(
		userId: User['id'],
		projectId: Project['id'],
		addedUserId: User['id'],
		role: ProjectMember['role']
	): Promise<void> {
		const hasPermission = await ProjectMembersDAO.getUserRole(projectId, userId);
		if (hasPermission && hasPermission !== 'owner') {
			throw new Error('You do not have permission to add members to this project');
		}
		await pool.query(
			'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = EXCLUDED.role',
			[projectId, addedUserId, role]
		);
	}

	static async removeMember(
		userId: User['id'],
		projectId: Project['id'],
		removeUserId: User['id']
	): Promise<void> {
		if (userId !== removeUserId) {
			const hasPermission = await ProjectMembersDAO.getUserRole(projectId, userId);
			if (hasPermission !== 'owner') {
				throw new Error('You do not have permission to remove members from this project');
			}
		}
		await pool.query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [
			projectId,
			removeUserId
		]);

		// Check if project still has members
		const result = await pool.query('SELECT COUNT(*) FROM project_members WHERE project_id = $1', [
			projectId
		]);
		if (parseInt(result.rows[0].count) === 0) {
			await ProjectDAO.deleteProject(userId, projectId);
		}
	}

	static async getMembers(projectId: Project['id']): Promise<ProjectMember[]> {
		const result = await pool.query(
			'SELECT pm.*, u.* FROM project_members pm JOIN users u ON pm.user_id = u.id WHERE pm.project_id = $1 ORDER BY pm.added_at ASC',
			[projectId]
		);
		return result.rows.map(ProjectMembersDAO.transformProjectMember);
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

	static async autocomplete(userId: User['id'], query: string, limit?: number): Promise<User[]> {
		limit ??= 5;
		const result = await pool.query(
			'SELECT * FROM users WHERE (username ILIKE $1 OR email ILIKE $1) AND id != $2 LIMIT $3',
			[`%${query}%`, userId, limit]
		);
		return result.rows.map(UserDAO.convertToUser);
	}
}
