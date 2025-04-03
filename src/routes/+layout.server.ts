import { loadTranslations } from '$lib/translations';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { lang } = locals;

  if (lang) await loadTranslations(lang);

  return locals;
};
