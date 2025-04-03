import { setLocale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  const { lang } = data;

  await setLocale(lang, true);

  return data;
};
