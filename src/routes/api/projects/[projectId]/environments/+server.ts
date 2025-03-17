import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EnvironmentDAO } from '$lib/server/db/environment';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;

	const environments = await EnvironmentDAO.getEnvironmentsByProjectId(user.id, params.projectId);
	return json({ environments });
};
