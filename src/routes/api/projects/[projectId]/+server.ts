import { ProjectDAO } from '$lib/server/db/project';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	const project = await ProjectDAO.getProjectById(user.id, params.projectId);
	if (!project) return error(404, 'Project not found');
	return json({ project });
};
