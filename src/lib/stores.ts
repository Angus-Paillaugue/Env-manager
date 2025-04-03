import { writable, type Writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';
interface ToastOptions {
  action?: {
    label: string;
    onClick: ({ dismiss }: { dismiss: () => void }) => void;
  };
  id?: string;
  timeout?: number;
}

export interface Toast {
  type: ToastType;
  message: string;
  id: string;
  options: ToastOptions;
}
export const toasts: Writable<Toast[]> = writable([]);

const generateId = () => Date.now().toString() + Math.floor(Math.random() * 10000).toString();

function newToast(type: ToastType, message: string, options: ToastOptions): string {
  if (options.id) {
    removeToast(options.id);
  }
  const newToast: Toast = {
    type: type,
    message,
    id: options.id || generateId(),
    options
  };
  // Add the new toast to the beginning of toasts the array.
  toasts.update((oldToast) => {
    oldToast.push(newToast);
    return oldToast;
  });

  // Remove the toast after 5 seconds.
  if (options.timeout !== -1)
    setTimeout(() => {
      removeToast(newToast.id);
    }, options.timeout || 4000);

  return newToast.id;
}

function removeToast(id: Toast['id']) {
  toasts.update((all) => all.filter((t) => t.id !== id));
}

export class toast {
  static success(message: string, options: ToastOptions = {}): string {
    return newToast('success', message, options);
  }

  static error(message: string, options: ToastOptions = {}): string {
    return newToast('error', message, options);
  }

  static info(message: string, options: ToastOptions = {}): string {
    return newToast('info', message, options);
  }

  static remove(id: string) {
    removeToast(id);
  }
}

export interface PageHeading {
  title: string;
  description?: string;
  breadcrumbs?: { title: string; href: string }[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export const pageHeading = writable<PageHeading>({ title: '', description: '' });
