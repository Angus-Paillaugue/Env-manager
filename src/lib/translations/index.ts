import i18n from 'sveltekit-i18n';
import { page } from '$app/state';
import { get, writable } from 'svelte/store';
import { config, defaultLocale } from './config';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const origin = writable('');

const {
	t,
	locale,
	locales,
	loading,
	addTranslations,
	loadTranslations,
	translations,
	setRoute,
	setLocale
} = new i18n(config);

const getAbsoluteUrl = (href: string) => {
	let url;
	try {
		url = new URL(href, get(origin));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_e) {
		url = new URL(href, page.url.origin);
	}
	return url;
};

export const localizeHref = (href: string, l?: string) => {
	const url = getAbsoluteUrl(href);
	l ??= get(locale); // Get the current locale if no override is provided
	if (l) {
		url.pathname = `/${l}${url.pathname}`; // Prepend the locale to the path
	}
	return url.toString();
};

export const unlocalizeHref = (href: string) => {
	const url = getAbsoluteUrl(href);
	const availableLocales = get(locales);
	const exp = new RegExp(`^/(${availableLocales.join('|')})`);
	url.pathname = url.pathname.replace(exp, '');
	return url.toString();
};

const mySetLocale = (l: string, hook?: boolean) => {
	setLocale(l);
	if (hook) {
		return;
	}
	// Redirect to the new locale
	const url = localizeHref(unlocalizeHref(page.url.pathname), l);
	if (url !== page.url.href) {
		if (browser && 'history' in window) {
			goto(url, { replaceState: true });
		}
	}
};

export {
	defaultLocale,
	t,
	locale,
	locales,
	loading,
	addTranslations,
	loadTranslations,
	translations,
	setRoute,
	mySetLocale as setLocale
};
