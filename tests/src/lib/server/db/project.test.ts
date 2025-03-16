import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ProjectDAO } from '$lib/server/db/project';
import pool from '$lib/server/db';
import { EnvironmentDAO } from '$lib/server/db/environment';

describe('ProjectDAO', () => {
	const sampleProjectRow = {
		id: 1,
		name: 'Test Project',
		created_at: new Date('2023-01-01T00:00:00.000Z'),
		environments: []
	};

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('createProject', () => {
		test('should create a project successfully', async () => {
			const name = 'New Project';
			const mockResult = {
				rows: [
					{
						id: 1,
						name,
						created_at: new Date('2023-02-01T10:00:00.000Z'),
						environments: []
					}
				]
			};

			const queryMock = vi.spyOn(pool, 'query').mockResolvedValueOnce(mockResult);

			const project = await ProjectDAO.createProject(name);
			expect(project).toEqual({
				id: 1,
				name,
				createdAt: new Date('2023-02-01T10:00:00.000Z'),
				environments: []
			});
			expect(queryMock).toHaveBeenCalledWith(
				'INSERT INTO projects (name) VALUES ($1) RETURNING *',
				[name]
			);
		});
	});

	describe('getProjectsByUser', () => {
		test('should return array of projects for the given user', async () => {
			const userId = 123;
			const mockResult = {
				rows: [
					{
						id: 1,
						name: 'Project One',
						created_at: new Date('2023-03-01T09:00:00.000Z'),
						environments: []
					},
					{
						id: 2,
						name: 'Project Two',
						created_at: new Date('2023-03-05T12:00:00.000Z'),
						environments: []
					}
				]
			};

			const queryMock = vi.spyOn(pool, 'query').mockResolvedValueOnce(mockResult);
			const projects = await ProjectDAO.getProjectsByUser(userId);
			expect(projects).toEqual([
				{
					id: 1,
					name: 'Project One',
					createdAt: new Date('2023-03-01T09:00:00.000Z'),
					environments: []
				},
				{
					id: 2,
					name: 'Project Two',
					createdAt: new Date('2023-03-05T12:00:00.000Z'),
					environments: []
				}
			]);
			expect(queryMock).toHaveBeenCalled();
		});
	});

	describe('getProjectById', () => {
		test('should return null if project is not found', async () => {
			const userId = 123;
			const projectId = 99;
			const mockResult = { rows: [] };

			const queryMock = vi.spyOn(pool, 'query').mockResolvedValueOnce(mockResult);
			const project = await ProjectDAO.getProjectById(userId, projectId);
			expect(project).toBeNull();
			expect(queryMock).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = $1', [projectId]);
		});

		test('should return project with environments when found', async () => {
			const userId = 123;
			const projectId = sampleProjectRow.id;
			// First query returns the project row
			const projectQueryResult = { rows: [sampleProjectRow] };
			const poolQueryMock = vi.spyOn(pool, 'query').mockResolvedValueOnce(projectQueryResult);

			// Spy and mock EnvironmentDAO.getEnvironmentsByProjectId to return dummy environments
			const dummyEnvironments = [
				{
					id: 10,
					projectId: sampleProjectRow.id,
					name: 'Env 1',
					createdAt: new Date('2023-04-01T08:00:00.000Z'),
					variables: []
				}
			];
			const environmentSpy = vi
				.spyOn(EnvironmentDAO, 'getEnvironmentsByProjectId')
				.mockResolvedValueOnce(dummyEnvironments);

			const project = await ProjectDAO.getProjectById(userId, projectId);
			expect(project).toEqual({
				id: sampleProjectRow.id,
				name: sampleProjectRow.name,
				createdAt: sampleProjectRow.created_at,
				environments: dummyEnvironments
			});
			expect(poolQueryMock).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = $1', [
				projectId
			]);
			expect(environmentSpy).toHaveBeenCalledWith(userId, sampleProjectRow.id);
		});
	});
});
