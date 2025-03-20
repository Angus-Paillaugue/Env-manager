import { ProjectDAO } from '$lib/server/db/project';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const { user } = locals;
	console.log(user);
	try {
		const projects = (await ProjectDAO.getProjectsByUser(user.id)) || [];
		return json({ projects });
	} catch (error) {
		return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
	}
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	const { name } = await request.json();

	if (!name || name.length < 3) {
		return json({ error: 'Project name must be at least 3 characters long' }, { status: 400 });
	}

	try {
		const project = await ProjectDAO.createProject(user.id, name);
		return json({ project });
	} catch (error) {
		return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
	}
};
