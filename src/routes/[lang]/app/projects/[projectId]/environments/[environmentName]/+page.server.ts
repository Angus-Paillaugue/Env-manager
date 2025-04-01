import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ErrorHandling } from '$lib/server/errorHandling';
import type { Environment, Project, Variable } from '$lib/types';

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
	async createVariable({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { variableName, variableValue, envFile } = formData as {
			variableName: string;
			variableValue: string;
			envFile: File;
		};

		// If an environment file is uploaded, read the content and create variables from it
		if (envFile.size > 0) {
			// Extract all of the variables from the uploaded file
			const envFileContent = await envFile.text();
			const lines = envFileContent.split('\n');
			const variables = lines
				.map((line) => {
					const [name, value] = line.split('=');
					return { name, value };
				})
				.filter(({ name, value }) => name && value);

			try {
				const res = await fetch(
					`/api/projects/${params.projectId}/environments/${params.environmentName}/variables`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ variables })
					}
				);
				const data = await res.json();
				if (!res.ok) {
					return new Error(data.error);
				}
			} catch (error) {
				return ErrorHandling.throwActionError(400, 'createVariable', error, true);
			}
		} else {
			// If no file is uploaded, create a single variable from the input fields
			try {
				const res = await fetch(
					`/api/projects/${params.projectId}/environments/${params.environmentName}/variables`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name: variableName, value: variableValue })
					}
				);
				const data = await res.json();
				if (!res.ok) {
					return Error(data.error);
				}
			} catch (error) {
				return ErrorHandling.throwActionError(400, 'createVariable', error, true);
			}
		}

		const environment = await getEnvironment(
			params.projectId as string,
			params.environmentName as string,
			fetch
		);
		return ErrorHandling.returnSuccess('createVariable', environment);
	},
	async deleteVariable({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { variableId } = formData as {
			variableId: Variable['id'];
		};

		try {
			const res = await fetch(
				`/api/projects/${params.projectId}/environments/${params.environmentName}/variables`,
				{
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: variableId })
				}
			);
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error);
			}
			return ErrorHandling.returnSuccess('deleteVariable', variableId);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'deleteVariable', error, true);
		}
	},
	async editVariable({ request, fetch, params }) {
		const formData = Object.fromEntries(await request.formData());
		const { variableName, variableValue, variableId } = formData as {
			variableName: string;
			variableValue: string;
			variableId: Variable['id'];
		};

		try {
			const res = await fetch(
				`/api/projects/${params.projectId}/environments/${params.environmentName}/variables`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: variableId, name: variableName, value: variableValue })
				}
			);
			const data = await res.json();
			if (!res.ok) {
				return ErrorHandling.throwActionError(res.status, 'editVariable', data.error, true);
			}
			return ErrorHandling.returnSuccess('editVariable', data.variable);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'editVariable', error, true);
		}
	}
};
