import { browser, dev } from '$app/environment';
import { page } from '$app/state';
import { get, readable, writable } from 'svelte/store';

interface Loader {
  locale: string;
  loader: () => Promise<Record<string, unknown>>;
}

export interface Config {
  defaultLocale: string;
  loaders: Loader[];
}

export class i18n {
  private _config: Config;
  private _locale = writable<string>('en');
  private _currentPageTranslations = $state<Record<string, string>>({});
  private _origin = writable<string>('');
  private _logPrefix = '[i18n]:';

  constructor(config: Config) {
    this._config = config;
    this._locale.set(config.defaultLocale);
  }

  private log(...args: unknown[]) {
    if (dev) console.log(this._logPrefix, ...args);
  }

  get locale() {
    return this._locale;
  }

  get locales() {
    return this._config.loaders.map((loader) => loader.locale);
  }

  get defaultLocale() {
    return this._config.defaultLocale;
  }

  get origin() {
    return this._origin;
  }

  setOrigin(origin: string) {
    this.log(`Setting origin to "${origin}"`);
    this._origin.set(origin);
  }

  private getAbsoluteUrl = (href: string) => {
    let url;
    try {
      url = new URL(href, get(this._origin));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      url = new URL(href, page.url.origin);
    }
    return url;
  };

  localizeHref = (href: string, l?: string) => {
    const url = this.getAbsoluteUrl(href);

    // First, remove any existing locale prefix to avoid double prefixes
    const exp = new RegExp(`^/(${this.locales.join('|')})`);
    url.pathname = url.pathname.replace(exp, '');

    // Then add the current locale prefix
    l ??= get(this.locale);
    if (l) {
      url.pathname = `/${l}${url.pathname}`;
    }

    return url.toString();
  };

  unlocalizeHref = (href: string) => {
    const url = this.getAbsoluteUrl(href);
    const exp = new RegExp(`^/(${this.locales.join('|')})`);
    url.pathname = url.pathname.replace(exp, '');
    return url.toString();
  };

  setLocale(locale: string, hook?: boolean) {
    this.log(`Setting locale to "${locale}"`);
    if (this.isLocaleSupported(locale)) {
      this._locale.set(locale);
      this.loadTranslations(locale);
    } else {
      this.log(`Locale ${locale} not supported`);
      throw new Error(`Locale ${locale} not supported`);
    }

    if (hook) {
      return;
    }
    // Redirect to the new locale
    const url = this.localizeHref(this.unlocalizeHref(page.url.pathname), locale);
    if (url !== page.url.href) {
      if (browser && 'history' in window) {
        // goto(url, { replaceState: true });
        // TODO: make the localizeHref function return reactive values so wo can use the builtin goto function to not have to reload the page. This is a workaround for SvelteKit's goto function until we implement the reactivity
        window.location.href = url;
      }
    }
  }

  private isLocaleSupported(locale: string): boolean {
    return this.locales.includes(locale);
  }

  // Take a deeply nested object and flatten it into a single level object with dot notation
  private flattenTranslations(
    translations: Record<string, unknown>,
    prefix = ''
  ): Record<string, string> {
    return Object.entries(translations).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return {
            ...acc,
            ...this.flattenTranslations(value as Record<string, unknown>, `${prefix}${key}.`)
          };
        }
        acc[`${prefix}${key}`] = value as string;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  // Load translations for the current locale in memory
  async loadTranslations(locale: string) {
    const loader = this._config.loaders.find((l) => l.locale === locale);
    if (loader) {
      this._currentPageTranslations = this.flattenTranslations(await loader.loader());
    } else {
      throw new Error(`Loader for locale ${locale} not found`);
    }

    this.log(
      `${Object.keys(this._currentPageTranslations).length} "${locale}" translations loaded`
    );
  }

  // Get the translations for the current page
  get translations() {
    return this._currentPageTranslations;
  }

  // Main client entrypoint to get a single translation.
  // Updates when the locale changes
  get t() {
    return readable((key: string, params?: Record<string, unknown>) => {
      const translation = this._currentPageTranslations[key];
      if (translation) {
        return translation.replace(/\{{([a-zA-Z0-9]+)\}}/g, (_, index) =>
          String(params?.[index] || '')
        );
      } else {
        this.log(`Translation for key "${key}" not found`);
      }
      return key;
    });
  }
}
