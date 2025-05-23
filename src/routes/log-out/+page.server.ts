import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
  delete locals.user;
  cookies.delete('token', { path: '/' });

  throw redirect(303, '/auth');
}) satisfies PageServerLoad;
