import { redirect, type Actions } from '@sveltejs/kit';
import { generateAccessToken, tokenOptions } from '$lib/server/auth';
import { UserDAO } from '$lib/server/db/user';
import { ErrorHandling } from '$lib/server/errorHandling';
import { translate } from '$lib/translations';
import { isEmailValid } from '$lib/utils';
import { Logger } from '$lib/utils/logger';
import bcrypt from 'bcryptjs';

export const load = async ({ locals, url }) => {
  if (locals.user) {
    const redirectUrl = url.searchParams.get('redirect') || '/app';
    throw redirect(302, redirectUrl);
  }
};

export const actions: Actions = {
  async signUp({ cookies, request }) {
    const formData = Object.fromEntries(await request.formData());
    const { email, password, username } = formData as {
      email: string;
      password: string;
      username: string;
    };

    // Check if username is provided
    if (!email || !isEmailValid(email))
      return ErrorHandling.throwActionError(400, 'signUp', { error: translate('errors.noEmail') });

    // Check if password is provided
    if (password.length < 6)
      return ErrorHandling.throwActionError(400, 'signUp', {
        error: translate('errors.passwordTooShort')
      });

    if (!username)
      return ErrorHandling.throwActionError(400, 'signUp', {
        error: translate('errors.noUsername')
      });

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Create user
      const user = await UserDAO.createUser(email, username, hash);

      cookies.set('token', generateAccessToken(user.id), tokenOptions);
    } catch (error) {
      Logger.error(error);
      return ErrorHandling.throwActionError(400, 'signUp', error, true);
    }

    throw redirect(303, '/app');
  }
};
