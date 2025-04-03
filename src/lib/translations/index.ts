import { config } from './config';
import { i18n } from './i18n.svelte';

// Create an i18n instance that we'll use throughout the app
const i18nInstance = new i18n(config);

// Export functions that properly maintain the 'this' context
export const t = i18nInstance.t;
export const locale = i18nInstance.locale;
export const locales = i18nInstance.locales;
export const translations = i18nInstance.translations;
export const defaultLocale = i18nInstance.defaultLocale;
export const origin = i18nInstance.origin;

// These functions need to be wrapped to maintain the correct 'this' binding
export const loadTranslations = (locale: string) => i18nInstance.loadTranslations(locale);
export const setLocale = (locale: string, hook?: boolean) => i18nInstance.setLocale(locale, hook);
export const localizeHref = (href: string, l?: string) => i18nInstance.localizeHref(href, l);
export const unLocalizeHref = (href: string, origin?: string) =>
  i18nInstance.unLocalizeHref(href, origin);
export const setOrigin = (origin: string) => i18nInstance.setOrigin(origin);
