import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const project = await fetch('/api/projects/' + params.projectId)
		.then((res) => res.json())
		.then((data) => data.project);
	if (!project) return error(404, 'Project not found');
	return { project };
}) satisfies LayoutServerLoad;
