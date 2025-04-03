import type { Config } from './i18n.svelte';

export const config: Config = {
  defaultLocale: 'en',
  loaders: [
    {
      locale: 'en',
      loader: async () => (await import('./i18n/en.json')).default
    },
    {
      locale: 'fr',
      loader: async () => (await import('./i18n/fr.json')).default
    }
  ]
};
