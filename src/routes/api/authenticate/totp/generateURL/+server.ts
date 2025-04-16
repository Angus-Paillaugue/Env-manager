import { json } from '@sveltejs/kit';
import { translate } from '$lib/translations';
import { Logger } from '$lib/utils/logger';
import speakeasy from 'speakeasy';
import type { RequestHandler } from './$types';

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
    Logger.error('Error generating TOTP Token :', error);
    throw new Error(translate('errors.errorGeneratingTOTP'));
  }
};
