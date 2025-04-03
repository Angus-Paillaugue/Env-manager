import { setLocale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  const { i18n } = data;
  const { lang } = i18n;

  await setLocale(lang, true);

  return i18n;
};
