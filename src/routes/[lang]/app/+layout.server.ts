import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to fetch projects');
    }
    const projects = data.projects || [];
    return { projects };
  } catch (e) {
    throw error(500, e instanceof Error ? e.message : 'Internal Server Error');
  }
}) satisfies LayoutServerLoad;
