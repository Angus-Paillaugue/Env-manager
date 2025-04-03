import { writeFileSync } from 'fs';
import dirTree from 'directory-tree';
import { config as i18nConfig } from '../src/lib/translations/config.ts';

const domain = 'https://env-manager.paillaugue.fr';
const baseRoute = '/';
let routes = new Set(baseRoute);
let date = new Date().toISOString().split('T')[0];
const languages = i18nConfig.loaders.map((loader) => loader.locale);

function getSitemapXML(domain, routes) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  routes.forEach((route, index) => {
    sitemap += (index > 0 ? '\n' : '') + getSitemapUrl(domain + route);
  });
  sitemap += '\n</urlset>';
  return sitemap;
}

function getSitemapUrl(location) {
  let url = `\t<url>\n\t\t<loc>${location}</loc>\n\t\t<lastmod>${date}</lastmod>\n\t</url>`;
  return url;
}

function getEndpoints(tree, route) {
  tree.children.forEach((child) => {
    if (
      child.children != undefined &&
      child.children.length != 0 &&
      !(route + child.name).includes('/app')
    ) {
      let childRoute = (route + child.name)
        .replace(/\(.*?\)/g, '')
        .replace(/(^\/{2,})|(^\/)/, '/')
        .replace(/\/{2,}/g, '/')
        .replace(/\[([^\]]+)\]/g, '{$1}');

      if (child.children.some((e) => e.name === '+page.svelte') && !routes.has(childRoute)) {
        // Replace "{lang}" with the available languages extracted from the i18n config
        languages.forEach((lang) => {
          routes.add(childRoute.replace(`{lang}`, lang));
        });
      }
      getEndpoints(child, route + child.name + '/');
    }
  });
}

const tree = dirTree('./src/routes');

getEndpoints(tree, baseRoute);

const sitemap = getSitemapXML(domain, Array.from(routes));

writeFileSync('static/sitemap.xml', sitemap);
console.log('Sitemap generated successfully!');
