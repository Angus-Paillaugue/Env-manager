import { error, redirect } from '@sveltejs/kit';
import { translate } from '$lib/translations';
import type { Docs } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const data = await parent();
  const getFirstPage = (page: Docs['Tree'][]): Docs['Tree'] | null => {
    for (const item of page) {
      if (item.type === 'file') {
        return item;
      }
      if (item.children) {
        const found = getFirstPage(item.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const firstDocPage = getFirstPage(data.tree);
  if (!firstDocPage) error(404, translate('errors.docsNotFound'));
  redirect(302, firstDocPage.url);
};
