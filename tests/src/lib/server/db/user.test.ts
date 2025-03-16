import { describe, test, expect, beforeEach, vi } from 'vitest';
import { UserDAO } from '$lib/server/db/user';
import pool from '$lib/server/db';

// language: typescript

describe('UserDAO.createUser', () => {
	const email = 'test@example.com';
	const username = 'testuser';
	const passwordHash = 'hashedpassword';
	const createdAt = new Date();

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	test('should create user successfully', async () => {
		// Setup mock for userExists (email) query
		const queryMock = vi
			.spyOn(pool, 'query')
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE email')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			})
			// Setup mock for userExistsByUsername query
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE username')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			})
			// Setup mock for INSERT query
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('INSERT INTO users')) {
					return Promise.resolve({
						rows: [
							{
								id: 1,
								email,
								username,
								password_hash: passwordHash,
								created_at: createdAt
							}
						]
					});
				}
				return Promise.resolve({ rows: [] });
			});

		const user = await UserDAO.createUser(email, username, passwordHash);
		expect(user).toEqual({
			id: 1,
			email,
			username,
			passwordHash,
			createdAt
		});
		expect(queryMock).toHaveBeenCalledTimes(3);
	});

	test('should throw error if email already exists', async () => {
		const queryMock = vi
			.spyOn(pool, 'query')
			// Simulate existing email for userExists query
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE email')) {
					return Promise.resolve({ rows: [{}] });
				}
				return Promise.resolve({ rows: [] });
			});

		await expect(UserDAO.createUser(email, username, passwordHash)).rejects.toThrow(
			'User with this email already exists'
		);
		expect(queryMock).toHaveBeenCalledTimes(1);
	});

	test('should throw error if username already exists', async () => {
		const queryMock = vi
			.spyOn(pool, 'query')
			// Email existence returns empty
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE email')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			})
			// Simulate existing username for userExistsByUsername query
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE username')) {
					return Promise.resolve({ rows: [{}] });
				}
				return Promise.resolve({ rows: [] });
			});

		await expect(UserDAO.createUser(email, username, passwordHash)).rejects.toThrow(
			'User with this username already exists'
		);
		expect(queryMock).toHaveBeenCalledTimes(2);
	});

	test('should throw error if insert fails to return a user', async () => {
		const queryMock = vi
			.spyOn(pool, 'query')
			// Email existence returns empty
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE email')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			})
			// Username existence returns empty
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('SELECT 1 FROM users WHERE username')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			})
			// INSERT query returns empty rows
			.mockImplementationOnce((sql: string) => {
				if (sql.includes('INSERT INTO users')) {
					return Promise.resolve({ rows: [] });
				}
				return Promise.resolve({ rows: [] });
			});

		await expect(UserDAO.createUser(email, username, passwordHash)).rejects.toThrow(
			'Failed to create user'
		);
		expect(queryMock).toHaveBeenCalledTimes(3);
	});
});
