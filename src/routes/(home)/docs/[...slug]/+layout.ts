import { constructTree } from './pages';

export async function load() {
  const pages = import.meta.glob('/docs/**/*', { eager: true });

  const tree = constructTree(pages);

  return { pages, tree };
}
