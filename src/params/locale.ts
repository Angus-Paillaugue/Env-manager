import { locales } from '$lib/translations';

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	const definedLocales = locales.get();
	const slashPaths = definedLocales.map((l) => `${l}/`);

	return [...definedLocales, ...slashPaths].includes(param);
}
