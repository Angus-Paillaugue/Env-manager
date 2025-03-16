import { ProjectDAO } from '$lib/server/db/project';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const projects = await ProjectDAO.getProjectsByUser(locals.user.id);
	return json({ projects });
};
