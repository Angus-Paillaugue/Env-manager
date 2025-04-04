import { setLocale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  const { i18n } = data;

  await setLocale(i18n.lang, true);

  return data;
};
