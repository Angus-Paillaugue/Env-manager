import { ProjectDAO } from '$lib/server/db/project';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	const project = await ProjectDAO.getProjectById(user.id, params.projectId);
	if (!project) return error(404, 'Project not found');
	return json({ project });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	const { projectId } = params;
	try {
		await ProjectDAO.deleteProject(user.id, projectId);
		return json({ projectId, success: true });
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return json({ error: msg }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const { user } = locals;
	const { projectId } = params;
	const { name } = await request.json();
	try {
		const project = await ProjectDAO.getProjectById(user.id, params.projectId as string);
		if (!project) {
			throw new Error('Project not found');
		}
		project.name = name;
		await ProjectDAO.updateProject(user.id, project);
		return json({ projectId, success: true });
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return json({ error: msg }, { status: 500 });
	}
};
