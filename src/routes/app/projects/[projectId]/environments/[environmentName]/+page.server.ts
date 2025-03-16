import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { VariableDAO } from '$lib/server/db/variable';
import { EnvironmentDAO } from '$lib/server/db/environment';
import { ErrorHandling } from '$lib/server/errorHandling';
import type { Environment, Project } from '$lib/types';

async function getEnvironment(
	projectId: Project['id'],
	environmentName: Environment['name'],
	customFetch?: typeof window.fetch
): Promise<Environment> {
	const environmentRes = await (customFetch ?? fetch)(
		`/api/projects/${projectId}/environments/${environmentName}`
	);
	const data = await environmentRes.json();
	if (!environmentRes.ok) return error(environmentRes.status, data.message);
	if (!data) return error(404, 'Environment not found');
	const environment = data.environment;
	if (!environment) return error(404, 'Project not found');
	return environment;
}

export const load = (async ({ params, fetch }) => {
	const { projectId, environmentName } = params;
	const environment = await getEnvironment(projectId, environmentName, fetch);
	return { environment };
}) satisfies PageServerLoad;

export const actions: Actions = {
	async createVariable({ request, params, locals, fetch }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { variableName, variableValue, envFile } = formData as {
			variableName: string;
			variableValue: string;
			envFile: File;
		};

		// If an environment file is uploaded, read the content and create variables from it
		if (envFile) {
			// Extract all of the variables from the uploaded file
			const envFileContent = await envFile.text();
			const lines = envFileContent.split('\n');
			const variables = lines
				.map((line) => {
					const [name, value] = line.split('=');
					return { name, value };
				})
				.filter(({ name, value }) => name && value);

			// Insert each variable into the database
			for (const { name, value } of variables) {
				try {
					const environment = await EnvironmentDAO.getEnvironmentByName(
						user.id,
						params.projectId as string,
						params.environmentName as string
					);
					if (!environment) return error(404, 'Environment not found');
					await VariableDAO.createVariable(environment.id, name, value);
				} catch (error) {
					return ErrorHandling.throwActionError(400, 'createVariable', error);
				}
			}
		} else {
			// If no file is uploaded, create a single variable from the input fields
			try {
				const environment = await EnvironmentDAO.getEnvironmentByName(
					user.id,
					params.projectId as string,
					params.environmentName as string
				);
				if (!environment) return error(404, 'Environment not found');
				await VariableDAO.createVariable(environment.id, variableName, variableValue);
			} catch (error) {
				return ErrorHandling.throwActionError(400, 'createVariable', error);
			}
		}

		const environment = await getEnvironment(
			params.projectId as string,
			params.environmentName as string,
			fetch
		);
		return {
			action: 'createVariable',
			ok: true,
			body: environment
		};
	}
};
