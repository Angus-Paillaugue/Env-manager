import { UserDAO } from '$lib/server/db/user';
import { ErrorHandling } from '$lib/server/errorHandling';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async saveGeneral({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { name } = formData as {
			name: string;
		};

		// Setting new values
		user.username = name;

		try {
			const updatedUser = await UserDAO.updateUser(user);
			return ErrorHandling.returnSuccess('saveGeneral', updatedUser);
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'saveGeneral', error);
		}
	},
	async updateProfilePicture({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { profilePicture } = formData as {
			profilePicture: File;
		};

		try {
			const path = await UserDAO.uploadProfilePicture(user.id, profilePicture);
			return ErrorHandling.returnSuccess('updateProfilePicture', path);
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'updateProfilePicture', error);
		}
	},
	async deleteAccount({ locals }) {
		const { user } = locals;

		try {
			await UserDAO.deleteUser(user);
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'deleteAccount', error);
		}

		throw redirect(303, '/log-out');
	}
};
