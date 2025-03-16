import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MediaQuery } from 'svelte/reactivity';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp: Date) => {
	if (!(timestamp instanceof Date)) {
		timestamp = new Date(timestamp);
	}

	return timestamp.toLocaleString();
};

export function urlStartsWith(url: string, path: string | string[]): boolean {
	if (!url || !path) return false;
	if (path instanceof Array) return path.some((p) => urlStartsWith(url, p));
	// For the `/` path
	if (path.length === 1) return url.at(-1) === path;

	return url.startsWith(path);
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
	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;

	for (const key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);

		if (
			(isObjects &&
				!isDeepEqual(value1 as Record<string, unknown>, value2 as Record<string, unknown>)) ||
			(!isObjects && value1 !== value2)
		) {
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
