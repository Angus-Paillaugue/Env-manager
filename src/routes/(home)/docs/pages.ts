import { locale, translate } from '$lib/translations'; // Assuming these are exported from the mentioned files
import type { Docs } from '$lib/types';
import { get } from 'svelte/store';

const absolutePathStart = '/docs/';
export const slugify = (path: string) => {
  return path.split('.')[0].replace(/ /g, '-').replace(/_/g, '-').toLowerCase();
};

export const constructPage = (
  docs: Record<string, any>,
  path: string,
  locale: string
): Docs['Page'] => {
  const relativePath = path.replace(`${absolutePathStart}${locale}/`, '');
  const pageSlug = slugify(relativePath);
  const page = docs[path];
  const metadata = page.metadata as Docs['Metadata'];
  return {
    component: page.default,
    url: `/docs/${pageSlug}`,
    metadata
  };
};

export function constructTree(docs: Record<string, any>, locale: string): Docs['Tree'][] | [] {
  const root: Docs['Tree'] = { type: 'dir', name: '', url: '', children: [] };

  for (const path of Object.keys(docs)) {
    if (!path.startsWith(`${absolutePathStart}${locale}/`)) continue;

    const relativePath = path.replace(`${absolutePathStart}${locale}/`, '');
    const parts = relativePath.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const slug = slugify(parts.slice(0, index + 1).join('/'));
      const metadata = docs[path].metadata as Docs['Metadata'];
      const name = metadata.name || part.split('.')[0];

      if (isFile) {
        // Add file to the current directory
        current.children = current.children || [];
        current.children.push({
          type: 'file',
          name,
          url: `/docs/${slug}`,
          children: []
        });
      } else {
        // Add or navigate to the directory
        let dir = current.children?.find(
          (child) => child.type === 'dir' && child.name === part
        ) as Docs['Tree'];

        if (!dir) {
          dir = {
            type: 'dir',
            name: part,
            url: `/docs/${slug}`,
            children: []
          };
          current.children = current.children || [];
          current.children.push(dir);
        }

        current = dir;
      }
    });
  }

  return root.children || [];
}

export function pageBySlug(docs: Record<string, any>, slug: string): Docs['Page'] | null {
  const l = get(locale);
  for (const path of Object.keys(docs)) {
    const relativePath = path.replace(`${absolutePathStart}${l}/`, '');
    const pageSlug = slugify(relativePath);
    if (pageSlug === slug) {
      return constructPage(docs, path, l);
    }
  }
  return null;
}

// Helper function to get the tree for the current locale
export function getTreeForCurrentLocale(docs: Record<string, any>): Docs['Tree'][] | [] {
  const l = get(locale);
  // Check if locale is supported
  const supportedDocsLocale = new Set(
    Object.keys(docs).map((path) => path.replace(absolutePathStart, '').split('/')[0])
  );
  console.log(l);
  if (!supportedDocsLocale.has(l)) {
    throw new Error(translate('errors.unsupportedLocale', { locale: l }));
  }

  return constructTree(docs, l);
}
