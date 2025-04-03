import { loadTranslations } from '$lib/translations';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { lang } = locals;

  await loadTranslations(lang);

  return { i18n: { lang } };
};
