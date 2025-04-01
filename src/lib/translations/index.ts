import i18n from 'sveltekit-i18n';
import type { Config } from 'sveltekit-i18n';
import lang from './lang.json';
import { dev } from '$app/environment';

const config: Config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	translations: {
		en: { lang },
		fr: { lang }
	},
	loaders: [
		{
			locale: 'en',
			key: '',
			loader: async () => (await import('./i18n/en.json')).default
		},
		{
			locale: 'fr',
			key: '',
			loader: async () => (await import('./i18n/en.json')).default
		}
	]
};

export const defaultLocale = 'en';

export const {
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
