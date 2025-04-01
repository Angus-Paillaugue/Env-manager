import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { urlStartsWith } from '$lib/utils';
import { Logger } from '$lib/utils/logger';
import { sequence } from '@sveltejs/kit/hooks';
import { defaultLocale, locales } from '$lib/translations/';

const NEED_AUTH_ROUTES = ['/app', '/api/project'];

const authHandler: Handle = async ({ event, resolve }) => {
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
		return new Response(undefined, {
			headers: { location: '/auth/log-in' },
			status: 307
		});
	}

	const response = await resolve(event);
	response.headers.set(
		'X-Robots-Tag',
		urlStartsWith(url.pathname, NEED_AUTH_ROUTES) ? 'noindex, nofollow' : 'index, follow'
	);

	return response;
};

export const i18nHandler: Handle = async ({ event, resolve }) => {
	const { url, request } = event;
	const { pathname } = url;

	if (pathname.startsWith('/api')) {
		return resolve(event);
	}

	// Get defined locales
	const supportedLocales = locales.get().map((l) => l.toLowerCase());

	// Try to get locale from `pathname`.
	let locale = supportedLocales.find(
		(l) => l === `${pathname.match(/[^/]+?(?=\/|$)/)}`.toLowerCase()
	);

	// If route locale is not supported
	if (!locale) {
		// Get user preferred locale
		locale = `${`${request.headers.get('accept-language')}`.match(/^[a-z]{2}/i)}`.toLowerCase();

		// Set default locale if user preferred locale does not match
		if (!supportedLocales.includes(locale)) locale = defaultLocale;

		// 301 redirect
		return new Response(undefined, { headers: { location: `/${locale}${pathname}` }, status: 301 });
	}

	// Add html `lang` attribute
	return resolve(
		{ ...event, locals: { lang: locale } },
		{
			transformPageChunk: ({ html }) => html.replace(/<html.*>/, `<html lang="${locale}">`)
		}
	);
};

export const handle = sequence(i18nHandler, authHandler);
