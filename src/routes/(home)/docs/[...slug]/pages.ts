import type { Docs } from '$lib/types';

const absolutePathStart = '/docs/';
export const slugify = (path: string) => {
  return path.split('.')[0].replace(/ /g, '-').replace(/_/g, '-').toLowerCase();
};

export const constructPage = (docs: Record<string, any>, path: string): Docs['Page'] => {
  const relativePath = path.replace(absolutePathStart, '');
  const pageSlug = slugify(relativePath);
  const page = docs[path];
  const metadata = page.metadata as Docs['Metadata'];
  return {
    component: page.default,
    url: `/docs/${pageSlug}`,
    metadata
  };
};

export function constructTree(docs: Record<string, any>): Docs['Tree'][] | [] {
  const root: Docs['Tree'] = { type: 'dir', name: '', url: '', children: [] };

  for (const path of Object.keys(docs)) {
    const relativePath = path.replace(absolutePathStart, '');
    const parts = relativePath.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const slug = slugify(parts.slice(0, index + 1).join('/'));

      if (isFile) {
        // Add file to the current directory
        current.children = current.children || [];
        current.children.push({
          type: 'file',
          name: part.split('.')[0],
          url: `/docs/${slug}`,
          children: []
        });
      } else {
        // Add or navigate to the directory
        let dir = current.children?.find(
          (child) => child.type === 'dir' && child.name === part
        ) as Docs['Tree'];

        if (!dir) {
          dir = { type: 'dir', name: part, url: `/docs/${slug}`, children: [] };
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
  for (const path of Object.keys(docs)) {
    const relativePath = path.replace(absolutePathStart, '');
    const pageSlug = slugify(relativePath);
    if (pageSlug === slug) {
      return constructPage(docs, path);
    }
  }
  return null;
}
