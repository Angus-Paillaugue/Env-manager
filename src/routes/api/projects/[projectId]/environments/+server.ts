import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EnvironmentDAO } from '$lib/server/db/environment';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;

	const environments = await EnvironmentDAO.getEnvironmentsByProjectId(user.id, params.projectId);
	return json({ environments });
};

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const { user } = locals;
	const { name } = await request.json();

	if (!name || name.trim() === '') {
		return json({ error: 'Environment name is required' }, { status: 400 });
	}

	try {
		const environment = await EnvironmentDAO.createEnvironment(user.id, params.projectId, name);
		return json({ environment });
	} catch (error) {
		return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
	}
};
