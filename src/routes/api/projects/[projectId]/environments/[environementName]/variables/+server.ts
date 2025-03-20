import type { RequestHandler } from './$types';
import { json, text } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import type { Variable } from '$lib/types';
import { VariableDAO } from '$lib/server/db/variable';

export const GET: RequestHandler = async ({ params, locals, url, fetch }) => {
	const { user } = locals;
	const environment = await EnvironmentDAO.getEnvironmentByName(
		user.id,
		params.projectId,
		params.environementName
	);
	if (!environment) return json({ message: 'Environment not found' }, { status: 404 });

	const res = await fetch(
		`/api/projects/${params.projectId}/environments/${environment.id}/variables`
	);
	const { variables }: { variables: Variable[] } = await res.json();

	if (url.searchParams.has('raw'))
		return text(variables.map((variable) => `${variable.name}=${variable.value}`).join('\n'));

	return json({ variables });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { user } = locals;
	const environment = await EnvironmentDAO.getEnvironmentByName(
		user.id,
		params.projectId,
		params.environementName
	);
	if (!environment) return json({ message: 'Environment not found' }, { status: 404 });

	const { variables }: { variables: Variable[] } = await request.json();

	await Promise.all(
		variables.map((variable) =>
			VariableDAO.createVariable(user.id, environment.id, variable.name, variable.value)
		)
	);

	return json({ message: 'Variables created' });
};
