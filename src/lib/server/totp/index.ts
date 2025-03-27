import type { User } from '$lib/types';
import { UserDAO } from '$lib/server/db/user';
import speakeasy from 'speakeasy';
import { Logger } from '$lib/utils/logger';

export const validateTOTP = async (secret: string, token: string) => {
	const verified = speakeasy.totp.verify({
		secret,
		encoding: 'base32',
		token,
		window: 1 // Allows some leeway for clock drift
	});
	if (!verified) throw new Error('Invalid token');

	return verified;
};

export const registerTOTP = async (user: User) => {
	try {
		// Generate a new TOTP secret
		const secret = speakeasy.generateSecret({ length: 20 });

		// Store secret in database
		await UserDAO.setTOTPSecret(user.id, secret.base32);

		// Generate QR Code url
		const otpAuthUrl =
			secret.otpauth_url ??
			`otpauth://totp/EnvManager:${user.email}?secret=${secret.base32}&issuer=EnvManager`;

		return otpAuthUrl;
	} catch (error) {
		Logger.error('Error generating TOTP:', error);
		throw new Error('Error generating TOTP');
	}
};

export interface UnlinkTOTPRequest {
	user: User;
	timestamp: number;
}

export const unlinkTOTPEmailRequestTokens = new Map<string, UnlinkTOTPRequest>();
