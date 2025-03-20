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
				if (err) return reject(err);
				try {
					const user = await UserDAO.getUserById(decoded as string);
					if (!user) return reject('User not found');
					resolve(user);
				} catch (error) {
					console.error('Error finding user:', error);
					reject('User not found');
				}
			});
		} catch (error) {
			console.error('Error verifying token:', error);
			reject({ error: 'Error verifying token' });
		}
	});
}

function generateAccessToken(id: User['id']): string {
	return jwt.sign(id, env.JWT_SECRET as string);
}
const tokenOptions = {
	httpOnly: true,
	secure: true,
	path: '/',
	maxAge: 60 * 60 * 24 // 1 day
};

export { auth, generateAccessToken, tokenOptions };
