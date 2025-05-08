import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { IS_PUBLIC_WEBSITE } from '$env/static/private';
import { auth } from '$lib/server/auth';
import { defaultLocale, config as i18nConfig, locales, origin } from '$lib/translations/';
import { urlStartsWith } from '$lib/utils';
import { NEED_AUTH_ROUTES, NO_I18N_OVERRIDES_ROUTES } from '$lib/utils/constants';
import { Logger } from '$lib/utils/logger';

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

  if (
    IS_PUBLIC_WEBSITE &&
    (urlStartsWith(url.pathname, NEED_AUTH_ROUTES) ||
      urlStartsWith(url.pathname, ['/auth', '/api']))
  ) {
    redirect(303, '/');
  }

  if (!locals.user && urlStartsWith(url.pathname, NEED_AUTH_ROUTES)) {
    // Redirect to login page if user is not logged in and trying to access a protected route
    redirect(303, '/auth/log-in');
  }

  const response = await resolve(event);
  response.headers.set(
    'X-Robots-Tag',
    urlStartsWith(url.pathname, NEED_AUTH_ROUTES) ? 'noindex, nofollow' : 'index, follow'
  );

  return response;
};

export const i18nHandler: Handle = async ({ event, resolve }) => {
  const { url, request, cookies } = event;
  const { pathname } = url;

  origin.set(url.origin);

  if (NO_I18N_OVERRIDES_ROUTES.some((route) => urlStartsWith(pathname, route))) {
    return resolve(event);
  }

  let locale = cookies.get('locale');

  if (!locale) {
    // Get user preferred locale
    locale = `${`${request.headers.get('accept-language')}`.match(/^[a-z]{2}/i)}`.toLowerCase();

    // Set default locale if user preferred locale does not match
    if (!locales.includes(locale)) locale = defaultLocale;
  }

  const localeConfig = i18nConfig.loaders.find((l) => l.locale === locale);

  // Add html `lang` attribute
  event.locals.i18n = {
    lang: locale,
    dir: localeConfig!.dir || 'ltr'
  };

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('%lang%', locale).replace('%dir%', localeConfig!.dir || 'ltr')
  });
};

export const handle = sequence(i18nHandler, authHandler);
