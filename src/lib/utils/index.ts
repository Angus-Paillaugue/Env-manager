import { origin } from '$lib/translations';
import { clsx, type ClassValue } from 'clsx';
import { MediaQuery } from 'svelte/reactivity';
import { get } from 'svelte/store';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp: Date) => {
  if (!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp);
  }

  return timestamp.toLocaleString();
};

export function urlStartsWith(url: string, path: string | string[] | RegExp, o?: string): boolean {
  if (!url || !path) return false;
  const pathname = new URL(url, o || get(origin)).pathname;
  if (Array.isArray(path)) return path.some((p) => urlStartsWith(pathname, p));
  if (path instanceof RegExp) return path.test(pathname);
  // For the `/` path
  if (path.length === 1) return pathname.at(-1) === path;

  return pathname.startsWith(path);
}

export const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface DebounceConfig {
  delay?: number;
  callback: (value: string) => void;
}
export const debounce = (node: HTMLInputElement | HTMLTextAreaElement, config: DebounceConfig) => {
  const { delay = 0, callback } = config;

  let timer: ReturnType<typeof setTimeout>;

  const handleChange = () => {
    const { value } = node;

    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };

  node.addEventListener('input', handleChange);

  return {
    destroy() {
      node.removeEventListener('input', handleChange);
    }
  };
};

export const isDeepEqual = (
  object1: Record<string, unknown>,
  object2: Record<string, unknown>
): boolean => {
  if (object1 === object2) return true;

  if (typeof object1 !== 'object' || typeof object2 !== 'object') return false;

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    const value1 = object1[key];
    const value2 = object2[key];

    if (isObject(value1) && isObject(value2)) {
      if (!isDeepEqual(value1 as Record<string, unknown>, value2 as Record<string, unknown>)) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }

  return true;
};

const isObject = (object: unknown): object is Record<string, unknown> => {
  return object != null && typeof object === 'object';
};

export const noop = (...args: unknown[]) => {
  void args;
};

export const isMobile = new MediaQuery('width < 48rem');

export function cloneObject(obj: Record<string, unknown>): Record<string, unknown> {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cloneObject) as unknown as Record<string, unknown>;
  }

  const clonedObj: Record<string, unknown> = {};

  for (const key in obj) {
    clonedObj[key] = cloneObject(obj[key] as Record<string, unknown>);
  }

  return clonedObj;
}

export function copyToClipboard(value: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(value);
  } else {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
