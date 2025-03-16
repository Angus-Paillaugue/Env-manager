import { redirect, type Actions } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import { ErrorHandling } from '$lib/server/errorHandling';
import type { Environment } from '$lib/types';

export const actions: Actions = {
	async createEnvironment({ request, params }) {
		const formData = Object.fromEntries(await request.formData());
		const { environmentName } = formData as { environmentName: string };

		let environment: Environment | null = null;
		try {
			environment = await EnvironmentDAO.createEnvironment(
				params.projectId as string,
				environmentName
			);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'createEnvironment', error);
		}
		throw redirect(303, `/app/projects/${params.projectId}/environments/${environment.name}`);
	}
};
