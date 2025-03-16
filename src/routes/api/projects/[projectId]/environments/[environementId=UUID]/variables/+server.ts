import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { VariableDAO } from '$lib/server/db/variable';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;
	const variables = await VariableDAO.getVariablesByEnvironment(user.id, params.environementId);

	return json({ variables });
};
