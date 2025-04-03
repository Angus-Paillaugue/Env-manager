import { redirect } from '@sveltejs/kit';
import { localizeHref } from '$lib/translations';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  throw redirect(308, localizeHref('/auth/log-in'));
};
