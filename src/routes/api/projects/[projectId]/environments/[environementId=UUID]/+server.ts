import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EnvironmentDAO } from '$lib/server/db/environment';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;
	const environment = await EnvironmentDAO.getEnvironmentById(user.id, params.environementId);
	return json({ environment });
};
