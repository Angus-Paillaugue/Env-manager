import type { Project, User } from '$lib/types';
import pool from '.';
import { EnvironmentDAO } from './environment';
import { ProjectMembersDAO } from './projectMember';

export class ProjectDAO {
	static convertToProject(row: Record<string, never>): Project {
		return {
			id: row.id,
			name: row.name,
			createdAt: row.created_at,
			environments: row.environments || [],
			members: row.members || []
		};
	}

	static async createProject(name: Project['name']): Promise<Project> {
		const result = await pool.query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name]);
		return ProjectDAO.convertToProject(result.rows[0]);
	}

	static async getProjectsByUser(userId: User['id']): Promise<Project[]> {
		const result = await pool.query(
			`SELECT p.* FROM projects p
			JOIN project_members pm ON p.id = pm.project_id
			WHERE pm.user_id = $1
      ORDER BY p.created_at DESC`,
			[userId]
		);
		// Get all of the projects and their environments
		await Promise.all(
			result.rows.map(async (row) => {
				row.environments = await EnvironmentDAO.getEnvironmentsByProjectId(userId, row.id);
				row.members = await ProjectMembersDAO.getMembers(row.id);
			})
		);
		return result.rows.map(ProjectDAO.convertToProject);
	}

	static async getProjectById(
		userId: User['id'],
		projectId: Project['id']
	): Promise<Project | null> {
		const result = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
		if (result.rows.length === 0) return null;
		const project = ProjectDAO.convertToProject(result.rows[0]);
		project.environments = await EnvironmentDAO.getEnvironmentsByProjectId(userId, project.id);
		project.members = await ProjectMembersDAO.getMembers(project.id);
		return project;
	}
}
