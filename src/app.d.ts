import type { User } from '$lib/types';
import type { locales } from '$lib/translations/config';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
		}
		type locale = locales[number];
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
