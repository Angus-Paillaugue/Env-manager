import { isEmailValid } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserDAO } from '$lib/server/db/user';
import bcrypt from 'bcryptjs';
import { auth, generateAccessToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const bearer = request.headers.get('Authorization');
	if (bearer) {
		const user = await auth(bearer.replace('Bearer ', ''));
		if (user) {
			return json({ success: true, message: 'Logged in successfully!', token: bearer });
		} else {
			return json({ error: 'You must log in first!' }, { status: 401 });
		}
	} else {
		const { email, password } = (await request.json()) as { email: string; password: string };

		// Check if username is provided
		if (!email || !isEmailValid(email))
			return json({ error: 'Please enter a email!' }, { status: 400 });

		// Check if password is provided
		if (!password) return json({ error: 'Please enter a password!' }, { status: 400 });

		try {
			const user = await UserDAO.getUserByEmail(email);

			// If user does not exist, return error
			if (!user) return json({ error: 'No account with this email!' }, { status: 400 });

			const compare = bcrypt.compareSync(password, user.passwordHash);

			// If password is incorrect, return error
			if (!compare) return json({ error: 'Incorrect password!' }, { status: 400 });
		} catch (error) {
			console.error(error);
			return json(
				{ error: error instanceof Error ? error.message : 'An error occurred!' },
				{ status: 500 }
			);
		}
		const token = generateAccessToken(email);
		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60 * 24,
			secure: false
		});

		return json({ success: true, message: 'Logged in successfully!', token: token });
	}
};
