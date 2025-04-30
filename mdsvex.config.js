import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkAttr from 'remark-attr';
import highlighter from './src/lib/components/docs/codeHighlighter.ts';


const config = {
  extensions: ['.md', '.svx', '.mdx'],
  remarkPlugins: [remarkAttr],
  rehypePlugins: [rehypeSlug],
  smartypants: false,
  highlight: {
    highlighter
  },
  layout: path.resolve('./src/lib/components/docs/markdown/blueprint.svelte')
};

export default config;
