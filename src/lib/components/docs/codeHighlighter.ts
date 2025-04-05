import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight
} from '@shikijs/transformers';
import { createHighlighter } from 'shiki';

const transformers = [
  transformerNotationDiff(),
  transformerMetaHighlight(),
  transformerNotationHighlight()
];

function parseMeta(meta: string) {
  const metaArray = meta?.split(' ');
  const params: { name: string; lineNumbers: boolean; copyCode: boolean; snippet: boolean } = {
    name: '',
    lineNumbers: false,
    copyCode: true,
    snippet: false
  };
  if (!metaArray) {
    return params;
  }
  if (metaArray && metaArray.some((item) => item.startsWith('lineNumbers'))) {
    const match = metaArray.find((item) => item.startsWith('lineNumbers'));
    if (match && match.includes('=')) {
      params.lineNumbers =
        match.slice(11).replace(/=/g, '').replace(/"/g, '').replace(/'/g, '') == 'true';
    } else {
      params.lineNumbers = true;
    }
  }
  params.copyCode = metaArray && !metaArray.some((item) => item.startsWith('no-copy'));
  params.snippet = metaArray && metaArray.some((item) => item.startsWith('snippet'));
  if (metaArray && metaArray.some((item) => item.startsWith('name='))) {
    const nameItem = metaArray.find((item) => item.startsWith('name='));
    if (nameItem) {
      params.name = nameItem.slice(5).replace(/"/g, '').replace(/'/g, '');
    }
  }
  return params;
}

async function highlighter(code: string, lang: string, meta: string) {
  const highlighter = await createHighlighter({
    langs: [lang],
    themes: ['github-dark-dimmed']
  });

  const { name, lineNumbers, copyCode, snippet } = parseMeta(meta);

  let html;
  if (!meta) {
    html = highlighter.codeToHtml(code, {
      lang,
      theme: 'github-dark-dimmed',
      transformers: transformers
    });
  } else {
    html = highlighter.codeToHtml(code, {
      lang,
      theme: 'github-dark-dimmed',
      transformers: transformers,
      meta: { __raw: meta }
    });
  }
  highlighter.dispose();
  return escapeHtml(
    `<Components.pre name="${name}" lineNumbers=${lineNumbers} copyCode=${copyCode} snippet=${snippet}>` +
      html +
      `</Components.pre>`
  );
}

function escapeHtml(code: string): string {
  return code.replace(
    /[{}`]/g,
    (character) =>
      ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' })[character as string] || character
  );
}

export default highlighter;
