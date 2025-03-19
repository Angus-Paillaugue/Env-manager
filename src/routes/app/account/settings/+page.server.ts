import { UserDAO } from '$lib/server/db/user';
import { ErrorHandling } from '$lib/server/errorHandling';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { generateAccessToken, tokenOptions } from '$lib/server/auth';
import { validateTOTP } from '$lib/server/totp';

export const actions: Actions = {
	async saveGeneral({ request, locals, cookies }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { email } = formData as {
			email: string;
		};

		// Setting new values
		// user.username = name;
		user.email = email;

		try {
			const updatedUser = await UserDAO.updateUser(user);
			cookies.set('token', generateAccessToken(user.email), tokenOptions);
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
	},
	async unlinkTOTP({ locals }) {
		const { user } = locals;
		try {
			await UserDAO.unlinkTOTP(user.id);
			return ErrorHandling.returnSuccess('unlinkTOTP', { success: true });
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'unlinkTOTP', error);
		}
	},
	async setUpTOTP({ locals, request }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { totp, TOTPsecret } = formData as {
			totp: string;
			TOTPsecret: string;
		};

		try {
			const success = await validateTOTP(TOTPsecret, totp);
			if (!success) throw new Error('Invalid TOTP code');
			await UserDAO.setTOTPSecret(user.id, TOTPsecret);
			return ErrorHandling.returnSuccess('setUpTOTP', { success });
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'setUpTOTP', error);
		}
	}
};
