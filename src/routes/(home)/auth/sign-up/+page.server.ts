import { generateAccessToken, tokenOptions } from '$lib/server/auth';
import { UserDAO } from '$lib/server/db/user';
import { isEmailValid } from '$lib/utils';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	async signUp({ cookies, request }) {
		const formData = Object.fromEntries(await request.formData());
		const { email, password, username } = formData as {
			email: string;
			password: string;
			username: string;
		};

		// Check if username is provided
		if (!email || !isEmailValid(email)) return fail(400, { error: 'Please enter a email!' });

		// Check if password is provided
		if (password.length < 6)
			return fail(400, { error: 'Password must be at least 6 characters long!' });

		try {
			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			// Create user
			await UserDAO.createUser(email, username, hash);

			cookies.set('token', generateAccessToken(email), tokenOptions);
		} catch (error) {
			console.error(error);
			return fail(400, { error: error instanceof Error ? error.message : 'An error occurred!' });
		}

		throw redirect(303, '/app');
	}
};
