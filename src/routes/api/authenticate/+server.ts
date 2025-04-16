import { json } from '@sveltejs/kit';
import { auth, generateAccessToken, tokenOptions } from '$lib/server/auth';
import { UserDAO } from '$lib/server/db/user';
import { validateTOTP } from '$lib/server/totp';
import { translate } from '$lib/translations';
import type { User } from '$lib/types';
import { isEmailValid } from '$lib/utils';
import { Logger } from '$lib/utils/logger';
import bcrypt from 'bcryptjs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const bearer = request.headers.get('Authorization');

  if (bearer) {
    try {
      const user = await auth(bearer.replace('Bearer ', ''));
      if (user) {
        return json({
          success: true,
          message: translate('api.authenticate.authSuccessFull'),
          token: bearer
        });
      } else {
        return json({ error: translate('errors.mustLogIn') }, { status: 401 });
      }
    } catch (error) {
      Logger.error('Error authenticating request :', error);
      return json(
        { error: error instanceof Error ? error.message : translate('errors.unknownError') },
        { status: 500 }
      );
    }
  } else {
    const {
      email,
      password,
      setCookie = false,
      totpCode
    } = (await request.json()) as {
      email: string;
      password: string;
      setCookie: boolean;
      totpCode?: string;
    };

    // Check if username is provided
    if (!email || !isEmailValid(email))
      return json({ error: translate('errors.noEmail') }, { status: 400 });

    // Check if password is provided
    if (!password) return json({ error: translate('errors.noPassword') }, { status: 400 });

    let user: User | null = null;
    try {
      user = await UserDAO.getUserByEmail(email);

      // If user does not exist, return error
      if (!user)
        return json({ error: translate('errors.noAccountWithThisEmail') }, { status: 400 });

      const compare = bcrypt.compareSync(password, user.passwordHash);

      // If password is incorrect, return error
      if (!compare) return json({ error: translate('errors.incorrectPassword') }, { status: 400 });
    } catch (error) {
      Logger.error("Error getting user info or checking it's password:",error);
      return json(
        { error: error instanceof Error ? error.message : translate('errors.unknownError') },
        { status: 500 }
      );
    }
    if (user.totpEnabled && user.totpSecret) {
      if (!totpCode) {
        return json(
          {
            error: translate('errors.needTOTP'),
            noTOTPCode: true
          },
          { status: 400 }
        );
      }

      try {
        const result = await validateTOTP(user.totpSecret, totpCode);
        if (!result) {
          return json({ error: translate('errors.invalidTOTP') }, { status: 400 });
        }
      } catch (error) {
        Logger.error('Error validating TOTP:', error);
        return json({ error: translate('errors.errorValidatingTOTP') }, { status: 500 });
      }
    }
    const token = generateAccessToken(user.id);
    if (setCookie) cookies.set('token', token, tokenOptions);

    return json({ success: true, message: translate('errors.loginSuccessFull'), token, user });
  }
};
