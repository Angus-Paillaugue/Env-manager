import { error } from '@sveltejs/kit';
import { translate } from '$lib/translations';
import { getTreeForCurrentLocale } from './pages';

export async function load() {
  const pages = import.meta.glob('/docs/**/*', { eager: true });

  try {
    const tree = getTreeForCurrentLocale(pages);

    return { pages, tree };
  } catch (e) {
    const message = e instanceof Error ? e.message : translate('errors.unknownError');
    error(500, { message });
  }
}
