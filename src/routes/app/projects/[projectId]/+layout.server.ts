import { error } from '@sveltejs/kit';
import type { Project } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
  const { projects }: { projects: Project[] } = await parent();

  const project = projects.find((p) => p.id === params.projectId);
  if (!project) return error(404, 'Project not found');

  return { project };
}) satisfies LayoutServerLoad;
