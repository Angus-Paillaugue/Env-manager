import { UserDAO } from '$lib/server/db/user';
import { ErrorHandling } from '$lib/server/errorHandling';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { unlinkTOTPEmailRequestTokens, validateTOTP } from '$lib/server/totp';
import bcrypt from 'bcryptjs';
import { sendMail } from '$lib/server/mail';
import { randomUUID } from 'crypto';

// TODO: This page still use direct DAO calls instead of calling the internal API
// We should move it sometime soon...

export const actions: Actions = {
	async saveGeneral({ request, locals }) {
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
			return ErrorHandling.returnSuccess('saveGeneral', updatedUser);
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'saveGeneral', error, true);
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
			return ErrorHandling.throwActionError(500, 'updateProfilePicture', error, true);
		}
	},
	async deleteAccount({ locals }) {
		const { user } = locals;

		try {
			await UserDAO.deleteUser(user);
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'deleteAccount', error, true);
		}

		throw redirect(303, '/log-out');
	},
	async unlinkTOTP({ locals, request, url }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { totp, method } = formData as {
			totp: string;
			method: 'TOTP' | 'mail';
		};

		if (method === 'TOTP') {
			try {
				if (!user.totpSecret) throw new Error('User does not have TOTP enabled');
				const success = await validateTOTP(user.totpSecret, totp);
				if (!success) throw new Error('Invalid TOTP code');
				await UserDAO.unlinkTOTP(user.id);
				return ErrorHandling.returnSuccess('unlinkTOTP', { success: true, method });
			} catch (error) {
				return ErrorHandling.throwActionError(500, 'unlinkTOTP', error, true);
			}
		} else {
			// Unused section because we do not provide a SMTP server yet
			const token = randomUUID();
			unlinkTOTPEmailRequestTokens.set(token, { user, timestamp: Date.now() });
			const confirmEmail = url.origin + '/app/account/settings/totp/unlink?token=' + token;
			const body = `
        <p>Dear ${user.username},</p>
        <p>We have received a request to unlink your TOTP from your account.</p>
        <p>If you did not make this request, please contact us immediately.</p>
        <p>Thank you.</p>
        <p>Please confirm your request by clicking <a href="${confirmEmail}">here</a>.</p>
      `;
			try {
				const { success } = await sendMail({ to: user.email, subject: 'Unlink TOTP', body });
				return ErrorHandling.returnSuccess('unlinkTOTP', { success, method });
			} catch (error) {
				return ErrorHandling.throwActionError(500, 'unlinkTOTP', error, true);
			}
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
			return ErrorHandling.throwActionError(500, 'setUpTOTP', error, true);
		}
	},
	async updatePassword({ locals, request }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { currentPassword, newPassword } = formData as {
			currentPassword: string;
			newPassword: string;
		};

		if (!user) {
			return ErrorHandling.throwActionError(401, 'updatePassword', 'User not authenticated');
		}
		if (!currentPassword || !newPassword) {
			return ErrorHandling.throwActionError(400, 'updatePassword', 'Missing required fields');
		}
		try {
			// Checking current password
			const compare = bcrypt.compareSync(currentPassword, user.passwordHash);
			if (!compare) {
				return ErrorHandling.throwActionError(400, 'updatePassword', 'Incorrect current password');
			}

			// Hashing new password
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(newPassword, salt);
			// Updating password in database
			const updatedUser = await UserDAO.updateUser({
				...user,
				passwordHash: hash
			});
			// Updating user in locals
			locals.user = updatedUser;

			return ErrorHandling.returnSuccess('updatePassword', { success: true });
		} catch (error) {
			return ErrorHandling.throwActionError(500, 'updatePassword', error, true);
		}
	}
};
