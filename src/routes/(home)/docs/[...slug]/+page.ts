import { error } from '@sveltejs/kit';
import { pageBySlug, slugify } from './pages';

export async function load({ params, parent }) {
  const data = await parent();
  const slug = slugify(params.slug);

  const page = pageBySlug(data.pages, slug);
  if (!page) error(404, 'Page not found');

  return { page, ...data };
}
