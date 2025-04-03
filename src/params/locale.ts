import { locales } from '$lib/translations';

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  const slashPaths = locales.map((l) => `${l}/`);

  return [...locales, ...slashPaths].includes(param);
}
