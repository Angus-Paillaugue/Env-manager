import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { urlStartsWith } from '$lib/utils';
import { Logger } from '$lib/utils/logger';

const NEED_AUTH_ROUTES = ['/app', '/api/project'];

export const handle = async ({ event, resolve }) => {
	const { url, cookies, locals } = event;
	const token =
		cookies.get('token') ||
		event.request.headers.get('Authorization')?.replace('Bearer ', '') ||
		null;

	// Check if the user is logged in, and if so, retrieve the user data
	if (token) {
		try {
			const user = await auth(token);
			if (user) {
				locals.user = user;
			} else {
				cookies.delete('token', { path: '/' });
				delete locals.user;
			}
		} catch (error) {
			Logger.error('Error verifying token:', error);
			delete locals.user;
			cookies.delete('token', { path: '/' });
		}
	}

	// Redirect to login page if user is not logged in and trying to access a protected route
	if (!locals.user && urlStartsWith(url.pathname, NEED_AUTH_ROUTES)) {
		throw redirect(307, '/auth/log-in');
	}

	const response = await resolve(event);
	response.headers.set(
		'X-Robots-Tag',
		urlStartsWith(url.pathname, NEED_AUTH_ROUTES) ? 'noindex, nofollow' : 'index, follow'
	);

	return response;
};
