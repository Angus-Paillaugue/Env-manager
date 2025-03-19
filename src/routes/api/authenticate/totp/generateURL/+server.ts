import type { RequestHandler } from './$types';
import speakeasy from 'speakeasy';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { user } = locals;
	try {
		// Generate a new TOTP secret
		const secret = speakeasy.generateSecret({ length: 20 });

		// Generate QR Code url
		const otpAuthUrl =
			secret.otpauth_url ??
			`otpauth://totp/EnvManager:${user.email}?secret=${secret.base32}&issuer=EnvManager`;

		return json({ url: otpAuthUrl, secret: secret.base32 });
	} catch (error) {
		console.error('Error generating TOTP:', error);
		throw new Error('Error generating TOTP');
	}
};
