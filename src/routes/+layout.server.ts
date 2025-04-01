import type { LayoutServerLoad } from './$types';
import { loadTranslations, translations } from '$lib/translations';

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load: LayoutServerLoad = async ({ url, locals }) => {
	const { pathname } = url;
	const { lang } = locals;

	const route = pathname.replace(new RegExp(`^/${lang}`), '');

	await loadTranslations(lang, route);

	return { i18n: { route, lang }, translations: translations.get() };
};
