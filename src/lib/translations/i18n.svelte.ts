import { browser, dev } from '$app/environment';
import chalk from 'chalk';
import { get, readable, writable } from 'svelte/store';
import { config } from './config';

type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Dir = 'rtl' | 'ltr';

interface Loader {
  locale: string;
  dir?: Dir;
  loader: () => Promise<Record<string, unknown>>;
}

type InternalConfig = Required<Config>;

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
          // Log everything in dev and only errors in prod
          if (dev || (!dev && loggerLevels.indexOf(l) <= 0)) console[l](...styledPrefix, ...args);
        }
      ];
    })
  );
};

const logger = loggerFactory();

export class i18n {
  private _config: InternalConfig;
  private _locale = writable<string>('en');
  private _currentPageTranslations = $state<Record<string, string>>({});
  private _origin = writable<string>('');
  private _dir = writable<Dir>('ltr');

  constructor(config: Config) {
    this._config = this.normalizeConfig(config);
    this._locale.set(config.defaultLocale);
    logger.debug(`i18n initialized with default locale "${config.defaultLocale}"`);
  }

  private normalizeConfig(config: Config): InternalConfig {
    const defaultDir = 'ltr';
    config.loaders.map((loader) => {
      loader.dir ??= defaultDir;
      return loader;
    });

    return config;
  }

  get config() {
    return this._config;
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

  get dir() {
    return this._dir;
  }

  setOrigin(origin: string) {
    logger.debug(`Setting origin to "${origin}"`);
    this._origin.set(origin);
  }

  setLocale(locale: string, hook?: boolean) {
    if (!locale) {
      return;
    }
    logger.debug(`Setting locale to "${locale}"`);
    if (this.isLocaleSupported(locale)) {
      if (locale !== get(this._locale)) {
        this._locale.set(locale);
        this._dir.set(config.loaders.find((l) => l.locale === locale)?.dir as Dir);
      }
      this.loadTranslations(locale);
    } else {
      logger.error(`Locale ${locale} not supported`);
      throw new Error(`Locale ${locale} not supported`);
    }

    if (hook) {
      return;
    }

    // First delete the old locale cookie
    document.cookie = `locale=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    // Then set the new locale cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
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
    if (locale === get(this._locale) && Object.keys(this._currentPageTranslations).length !== 0)
      return;
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

  // Translate a single translation and returns a string of it's value. No reactivity (mainly used on the server to i18n error messages)
  translate(key: string, params?: Record<string, unknown>) {
    logger.debug(get(this._locale));
    return get(this.t)(key, params);
  }
}
