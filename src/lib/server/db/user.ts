import type { User } from '$lib/types';
import pool from '.';

export class UserDAO {
	static convertToUser(row: Record<string, never>): User {
		return {
			id: row.id,
			email: row.email,
			username: row.username,
			passwordHash: row.password_hash,
			createdAt: row.created_at
		};
	}

	static async createUser(
		email: User['email'],
		username: User['username'],
		passwordHash: User['passwordHash']
	): Promise<User> {
		if (await UserDAO.userExists(email)) {
			throw new Error('User with this email already exists');
		}
		if (await UserDAO.userExistsByUsername(username)) {
			throw new Error('User with this username already exists');
		}
		const result = await pool.query(
			'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
			[email, username, passwordHash]
		);
		if (result.rows.length === 0) {
			throw new Error('Failed to create user');
		}
		return UserDAO.convertToUser(result.rows[0]);
	}

	static async getUserByEmail(email: User['email']): Promise<User | null> {
		const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
		if (result.rows.length === 0) {
			return null;
		}
		return UserDAO.convertToUser(result.rows[0]);
	}

	static async getUserById(id: User['id']): Promise<User | null> {
		const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
		if (result.rows.length === 0) {
			return null;
		}
		return UserDAO.convertToUser(result.rows[0]);
	}

	static async userExists(email: User['email']): Promise<boolean> {
		const result = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
		return result.rows.length > 0;
	}

	static async getUserByUsername(username: User['username']): Promise<User | null> {
		const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
		if (result.rows.length === 0) {
			return null;
		}
		return UserDAO.convertToUser(result.rows[0]);
	}

	static async userExistsByUsername(username: User['username']): Promise<boolean> {
		const result = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
		return result.rows.length > 0;
	}
}
