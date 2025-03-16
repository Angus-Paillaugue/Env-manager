import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { UserDAO } from './db/user';
import type { User } from '$lib/types';

/**
 * Authenticates a user based on the provided JWT token.
 */
async function auth(token: string): Promise<User | null> {
	return new Promise((resolve, reject) => {
		if (!token) reject({ error: 'No token was provided!' });
		try {
			jwt.verify(token, env.JWT_SECRET as string, async (err, decoded: unknown) => {
				if (err) return reject({ error: err });
				try {
					const user = await UserDAO.getUserByEmail(decoded as string);
					if (!user) reject({ error: 'User not found' });
					resolve(user);
				} catch (error) {
					console.error('Error finding user:', error);
					reject({ error: 'User not found' });
				}
			});
		} catch (error) {
			console.error('Error verifying token:', error);
			reject({ error: 'Error verifying token' });
		}
	});
}

function generateAccessToken(username: string): string {
	return jwt.sign(username, env.JWT_SECRET as string);
}

export { auth, generateAccessToken };
