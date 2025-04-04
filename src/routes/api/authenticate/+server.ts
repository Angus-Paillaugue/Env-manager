import { json } from '@sveltejs/kit';
import { auth, generateAccessToken, tokenOptions } from '$lib/server/auth';
import { UserDAO } from '$lib/server/db/user';
import { validateTOTP } from '$lib/server/totp';
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
        return json({ success: true, message: 'Logged in successfully!', token: bearer });
      } else {
        return json({ error: 'You must log in first!' }, { status: 401 });
      }
    } catch (error) {
      Logger.error(error);
      return json(
        { error: error instanceof Error ? error.message : 'An error occurred!' },
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
      return json({ error: 'Please enter a email!' }, { status: 400 });

    // Check if password is provided
    if (!password) return json({ error: 'Please enter a password!' }, { status: 400 });

    let user: User | null = null;
    try {
      user = await UserDAO.getUserByEmail(email);

      // If user does not exist, return error
      if (!user) return json({ error: 'No account with this email!' }, { status: 400 });

      const compare = bcrypt.compareSync(password, user.passwordHash);

      // If password is incorrect, return error
      if (!compare) return json({ error: 'Incorrect password!' }, { status: 400 });
    } catch (error) {
      Logger.error(error);
      return json(
        { error: error instanceof Error ? error.message : 'An error occurred!' },
        { status: 500 }
      );
    }
    if (user.totpEnabled && user.totpSecret) {
      if (!totpCode) {
        return json(
          {
            error: 'TOPT authentication required. Please provide the TOTP code.',
            noTOTPCode: true
          },
          { status: 400 }
        );
      }

      try {
        const result = await validateTOTP(user.totpSecret, totpCode);
        if (!result) {
          return json({ error: 'Invalid TOTP code.' }, { status: 400 });
        }
      } catch (error) {
        Logger.error('Error validating TOTP:', error);
        return json({ error: 'Error validating TOTP' }, { status: 500 });
      }
    }
    const token = generateAccessToken(user.id);
    if (setCookie) cookies.set('token', token, tokenOptions);

    return json({ success: true, message: 'Logged in successfully!', token, user });
  }
};
