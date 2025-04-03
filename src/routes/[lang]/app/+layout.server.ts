import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, fetch }) => {
  const { user } = locals;
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to fetch projects');
    }
    const projects = data.projects || [];
    return { projects, user };
  } catch (e) {
    throw error(500, e instanceof Error ? e.message : 'Internal Server Error');
  }
}) satisfies LayoutServerLoad;
