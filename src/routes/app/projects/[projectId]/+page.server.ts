import { redirect, type Actions, error } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import { ErrorHandling } from '$lib/server/errorHandling';
import type { Environment, ProjectMember } from '$lib/types';
import { UserDAO } from '$lib/server/db/user';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';

export const load = async ({ params, locals }) => {
	const { user } = locals;
	const { projectId } = params;

	try {
		const role = await ProjectMembersDAO.getUserRole(projectId, user.id);
		if (!role) {
			throw new Error('Unauthorized');
		}
	} catch (e) {
		return error(401, e instanceof Error ? e.message : 'Unauthorized');
	}
};

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
	},
	async deleteEnvironment({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { environmentId } = formData as {
			environmentId: string;
		};

		try {
			await EnvironmentDAO.deleteEnvironment(user.id, environmentId);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'deleteEnvironment', error);
		}

		return {
			ok: true,
			body: environmentId,
			action: 'deleteEnvironment'
		};
	},
	async editEnvironment({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { environmentId, environmentName } = formData as {
			environmentId: string;
			environmentName: string;
		};

		try {
			// Get environment
			const environment = await EnvironmentDAO.getEnvironmentById(user.id, environmentId);
			if (!environment) throw new Error('Environment not found');
			// Set new fields values
			environment.name = environmentName.trim();

			// Update environment
			const updatedEnvironment = await EnvironmentDAO.editEnvironment(
				user.id,
				environmentId,
				environment
			);
			return {
				ok: true,
				body: updatedEnvironment,
				action: 'editEnvironment'
			};
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'editEnvironment', error);
		}
	},
	async addMember({ request, locals, params }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { memberUsername } = formData as {
			memberUsername: string;
		};
		const role: ProjectMember['role'] = 'guest';

		if (!memberUsername)
			return ErrorHandling.throwActionError(400, 'addMember', 'Member username is required');

		const addedUser = await UserDAO.getUserByUsername(memberUsername);
		if (!addedUser) return ErrorHandling.throwActionError(400, 'addMember', 'User not found');
		try {
			await ProjectMembersDAO.addMember(user.id, params.projectId as string, addedUser.id, role);
			return {
				ok: true,
				body: {
					projectId: params.projectId,
					user: addedUser,
					role: role,
					userId: addedUser.id
				} as ProjectMember,
				action: 'addMember'
			};
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'addMember', error);
		}
	},
	async removeMember({ request, locals, params }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { memberId } = formData as {
			memberId: string;
		};

		try {
			await ProjectMembersDAO.removeMember(user.id, params.projectId as string, memberId);
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'removeMember', error);
		}

		if (user.id === memberId) {
			throw redirect(303, '/app');
		}

		return {
			ok: true,
			action: 'removeMember',
			body: memberId
		};
	}
};
