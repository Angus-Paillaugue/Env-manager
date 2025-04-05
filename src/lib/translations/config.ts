import type { Config } from './i18n.svelte';

export const config: Config = {
  defaultLocale: 'en',
  loaders: [
    {
      locale: 'en',
      loader: async () => (await import('./messages/en.json')).default
    },
    {
      locale: 'fr',
      loader: async () => (await import('./messages/fr.json')).default
    },
    {
      locale: 'eg',
      dir: 'rtl',
      loader: async () => (await import('./messages/eg.json')).default
    }
  ]
};
