// Unused page because we do not provide a SMTP server yet

import { error } from '@sveltejs/kit';
import { UserDAO } from '$lib/server/db/user';
import { unlinkTOTPEmailRequestTokens, type UnlinkTOTPRequest } from '$lib/server/totp';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return error(400, 'Missing token');
  }

  if (!unlinkTOTPEmailRequestTokens.has(token)) {
    return error(400, 'Invalid token');
  }

  const request = unlinkTOTPEmailRequestTokens.get(token) as UnlinkTOTPRequest;

  const currentTime = Date.now();
  if (currentTime - request.timestamp > 15 * 60 * 1000) {
    // 15 minutes expiration
    unlinkTOTPEmailRequestTokens.delete(token);
    return error(400, 'Token has expired');
  }
  if (request.user.id !== locals.user.id) {
    return error(400, 'Invalid token');
  }

  await UserDAO.unlinkTOTP(locals.user.id);
  unlinkTOTPEmailRequestTokens.delete(token);
};
