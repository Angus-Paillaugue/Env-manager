import type { RequestHandler } from './$types';
import { json, text } from '@sveltejs/kit';
import { VariableDAO } from '$lib/server/db/variable';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const { user } = locals;
	const variables = await VariableDAO.getVariablesByEnvironment(user.id, params.environementId);

	if (url.searchParams.has('raw')) {
		return text(variables.map((variable) => `${variable.name}=${variable.value}`).join('\n'));
	}
	return json({ variables });
};
