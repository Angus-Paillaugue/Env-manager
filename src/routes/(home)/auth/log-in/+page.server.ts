import { tokenOptions } from '$lib/server/auth';
import { UserDAO } from '$lib/server/db/user';
import { ErrorHandling } from '$lib/server/errorHandling';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (locals.user) {
		const redirectUrl = url.searchParams.get('redirect') || '/app';
		console.log('User is already logged-in, redirecting to:', redirectUrl);
		throw redirect(302, redirectUrl);
	}
};

export const actions: Actions = {
	async logIn({ cookies, request, fetch, url }) {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData as { email: string; password: string };
		const actualUrl = new URL(request.headers.get('referer') || url.origin);

		const res = await fetch('/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();

		if (data.noTOTPCode) {
			// Auth OK but need TOTP
			const user = await UserDAO.getUserByEmail(email);
			if (!user) {
				return ErrorHandling.throwActionError(400, 'logIn', 'No account with this email!');
			}

			if (user.totpEnabled && user.totpSecret) {
				return ErrorHandling.returnSuccess('logIn', { totp: true });
			}
		}
		if (!res.ok) {
			return fail(res.status, { error: data.error });
		}
		cookies.set('token', data.token, tokenOptions);

		if (actualUrl.searchParams.has('redirect')) {
			throw redirect(303, actualUrl.searchParams.get('redirect') as string);
		}
		throw redirect(302, '/app');
	},
	async confirmTOTP({ cookies, request, fetch, url }) {
		const formData = Object.fromEntries(await request.formData());
		const { totp, email, password } = formData as { totp: string; email: string; password: string };
		const actualUrl = new URL(request.headers.get('referer') || url.origin);

		// Check TOTP
		const totpRes = await fetch('/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ totpCode: totp, email, password })
		});
		const totpData = await totpRes.json();

		if (!totpRes.ok) {
			return ErrorHandling.throwActionError(totpRes.status, 'confirmTOTP', totpData.error);
		}
		cookies.set('token', totpData.token, tokenOptions);

		if (actualUrl.searchParams.has('redirect')) {
			throw redirect(303, actualUrl.searchParams.get('redirect') as string);
		}
		throw redirect(302, '/app');
	}
};
