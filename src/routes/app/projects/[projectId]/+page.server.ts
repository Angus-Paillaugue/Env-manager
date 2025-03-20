import { redirect, type Actions, error } from '@sveltejs/kit';
import { ErrorHandling } from '$lib/server/errorHandling';
import type { Environment } from '$lib/types';

export const load = async ({ params, fetch }) => {
	const { projectId } = params;

	try {
		const res = await fetch(`/api/projects/${projectId}/role`);
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error);
		}
	} catch (e) {
		return error(401, e instanceof Error ? e.message : 'Unauthorized');
	}
};

export const actions: Actions = {
	async createEnvironment({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { environmentName } = formData as { environmentName: string };

		let environment: Environment | null = null;
		try {
			const res = await fetch(`/api/projects/${params.projectId}/environments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: environmentName })
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data?.error || 'Failed to create environment');
			}

			environment = data.environment as Environment;
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'createEnvironment', error);
		}
		throw redirect(303, `/app/projects/${params.projectId}/environments/${environment.name}`);
	},
	async deleteEnvironment({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { environmentId } = formData as {
			environmentId: string;
		};

		try {
			const res = await fetch(`/api/projects/${params.projectId}/environments/${environmentId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ environmentId })
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to delete environment');
			}
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'deleteEnvironment', error);
		}

		return ErrorHandling.returnSuccess('deleteEnvironment', environmentId);
	},
	async editEnvironment({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { environmentName, environmentId } = formData as {
			environmentName: string;
			environmentId: string;
		};

		const newEnvironment: Partial<Environment> = {
			id: environmentId,
			name: environmentName.trim()
		};

		try {
			const res = await fetch(`/api/projects/${params.projectId}/environments/${environmentId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newEnvironment)
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to edit environment');
			}

			return ErrorHandling.returnSuccess('editEnvironment', data);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'editEnvironment', error);
		}
	},
	async addMember({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { memberUsername } = formData as {
			memberUsername: string;
		};
		if (!memberUsername)
			return ErrorHandling.throwActionError(400, 'addMember', 'Member username is required');
		try {
			const res = await fetch(`/api/projects/${params.projectId}/members`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ memberUsername })
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to add member');
			}

			return ErrorHandling.returnSuccess('addMember', data);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'addMember', error);
		}
	},
	async removeMember({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { memberId } = formData as {
			memberId: string;
		};

		try {
			const res = await fetch(`/api/projects/${params.projectId}/members`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ memberId })
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to remove member');
			}

			return ErrorHandling.returnSuccess('removeMember', data);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'removeMember', error);
		}
	},
	async saveSettings({ request, params, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { projectName } = formData as { projectName: string };

		try {
			const res = await fetch(`/api/projects/${params.projectId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: projectName })
			});
			const project = await res.json();
			return ErrorHandling.returnSuccess('saveSettings', project);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'saveSettings', error);
		}
	},
	async deleteProject({ params, fetch }) {
		try {
			const res = await fetch(`/api/projects/${params.projectId}`, {
				method: 'DELETE'
			});
			if (!res.ok) {
				const errorMsg = await res.json();
				throw new Error(errorMsg.error || res.statusText);
			}
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'deleteProject', error);
		}

		throw redirect(303, '/app');
	}
};
