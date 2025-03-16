import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, fetch }) => {
	const { user } = locals;
	const projects = await fetch('/api/projects')
		.then((res) => res.json())
		.then((data) => data.projects);
	return { user, projects };
}) satisfies LayoutServerLoad;
