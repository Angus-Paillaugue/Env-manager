import { browser, dev } from '$app/environment';
import { page } from '$app/state';
import chalk from 'chalk';
import { get, readable, writable } from 'svelte/store';

interface Loader {
  locale: string;
  loader: () => Promise<Record<string, unknown>>;
}

export interface Config {
  defaultLocale: string;
  loaders: Loader[];
}

const loggerLevels = ['error', 'warn', 'debug'] as const;

const loggerFactory = () => {
  const prefix = '[i18n]:';
  const color = '#f96743';

  return Object.fromEntries(
    loggerLevels.map((l) => {
      const styledPrefix = browser
        ? [`%c${prefix}`, `color: ${color}; font-weight: bold;`]
        : [chalk.hex(color).bold(prefix)];
      return [
        l,
        (...args: unknown[]) => {
          if (dev) console[l](...styledPrefix, ...args);
        }
      ];
    })
  );
};

const logger = loggerFactory();

export class i18n {
  private _config: Config;
  private _locale = writable<string>('en');
  private _currentPageTranslations = $state<Record<string, string>>({});
  private _origin = writable<string>('');

  constructor(config: Config) {
    this._config = config;
    this._locale.set(config.defaultLocale);
    logger.debug(`i18n initialized with default locale "${config.defaultLocale}"`);
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
    logger.debug(`Setting origin to "${origin}"`);
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
      url.pathname = `/${l}${url.pathname !== '/' ? url.pathname : ''}`;
    }

    return url.toString();
  };

  unLocalizeHref = (href: string, origin?: string) => {
    const url = origin ? new URL(href, origin) : this.getAbsoluteUrl(href);
    const exp = new RegExp(`^/(${this.locales.join('|')})`);
    url.pathname = url.pathname.replace(exp, '');
    return url.toString();
  };

  setLocale(locale: string, hook?: boolean) {
    if (!locale) {
      return;
    }
    logger.debug(`Setting locale to "${locale}"`);
    if (this.isLocaleSupported(locale)) {
      this._locale.set(locale);
      this.loadTranslations(locale);
    } else {
      logger.error(`Locale ${locale} not supported`);
      throw new Error(`Locale ${locale} not supported`);
    }

    if (hook) {
      return;
    }
    // Redirect to the new locale
    const url = this.localizeHref(this.unLocalizeHref(page.url.pathname), locale);
    if (url !== page.url.href) {
      if (browser && 'history' in window) {
        // goto(url, { replaceState: true });
        // TODO: make the localizeHref function return reactive values so wo can use the builtin goto function to not have to reload the page. This is a workaround for SvelteKit's goto function until we implement the reactivity
        window.location.href = url;
        // Set the locale in localStorage to persist the locale across page reloads
        // In the top most layout.svelte, this value is compared against the current page locale
        // If the do not match, the user is redirected to the localStorage locale
        localStorage.setItem('language-override', locale);
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
      logger.error(`Loader for locale ${locale} not found`);
      throw new Error(`Loader for locale ${locale} not found`);
    }

    logger.debug(
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
      if (Object.keys(this._currentPageTranslations).length === 0) {
        return key;
      }
      const translation = this._currentPageTranslations[key];
      if (translation) {
        return translation.replace(/\{{([a-zA-Z0-9]+)\}}/g, (_, index) =>
          String(params?.[index] || '')
        );
      } else {
        logger.warn(`Translation for key "${key}" not found`);
      }
      return key;
    });
  }
}
