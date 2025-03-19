import { tokenOptions } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	async logIn({ cookies, request, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData as { email: string; password: string };

		const res = await fetch('/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();

		if (!res.ok) {
			return fail(res.status, { error: data.error });
		}
		cookies.set('token', data.token, tokenOptions);

		throw redirect(303, '/app');
	}
};
