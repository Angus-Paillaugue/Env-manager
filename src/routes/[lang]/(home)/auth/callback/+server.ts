import { json, redirect } from '@sveltejs/kit';
import { auth, generateAccessToken } from '$lib/server/auth';
import { localizeHref } from '$lib/translations';
import { Logger } from '$lib/utils/logger';

export async function GET({ url, cookies }) {
  const state = url.searchParams.get('state');
  if (!state) return json({ error: 'Missing state parameter' }, { status: 400 });

  // Check if the user is already authenticated
  const cookie = cookies.get('token') || null;
  if (!cookie) {
    // Properly encode the redirect URL
    const redirectUrl = encodeURIComponent(`/auth/callback?state=${state}`);
    throw redirect(302, localizeHref(`/auth/log-in?redirect=${redirectUrl}`));
  }

  try {
    // Authenticate the user using the token
    const user = await auth(cookie);
    if (!user) {
      const redirectUrl = encodeURIComponent(`/auth/callback?state=${state}`);
      throw redirect(302, localizeHref(`/auth/log-in?redirect=${redirectUrl}`));
    }

    // Generate a new access token and associate it with the state
    const token = generateAccessToken(user.id);

    // Associate the token with the state
    const cliCallbackUrl = `http://localhost:3001/auth/callback?token=${encodeURIComponent(token)}`;
    try {
      await fetch(cliCallbackUrl);
    } catch (error) {
      Logger.error('Failed to notify CLI:', error);
    }
  } catch (error) {
    Logger.error('Authentication error:', error);
    return json({ error: 'Authentication failed' }, { status: 401 });
  }

  // Redirect to success page
  throw redirect(302, localizeHref('/auth/callback/success'));
}
