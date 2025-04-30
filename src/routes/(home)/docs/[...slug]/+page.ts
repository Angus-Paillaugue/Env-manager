import { error } from '@sveltejs/kit';
import { translate } from '$lib/translations';
import { pageBySlug, slugify } from '../pages';

export async function load({ params, parent }) {
  const data = await parent();
  const slug = slugify(params.slug);

  const page = pageBySlug(data.pages, slug);
  if (!page) error(404, translate('errors.pageNotFound'));

  return { page, ...data };
}
