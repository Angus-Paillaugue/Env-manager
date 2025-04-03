import axios from 'axios';
import keytar from 'keytar';
import { ConfigManager } from './config';
import { PROGRAM_NAME } from './constants';

const ACCOUNT_NAME = 'auth-token';
export class Auth {
  static async login(email: string, password: string, totpCode?: string) {
    const config = ConfigManager.getConfig();
    try {
      const response = await axios.post(`${config.apiUrl}/authenticate`, {
        email,
        password,
        totpCode
      });
      const token = response.data.token;
      Auth.saveToken(token);
      return token;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  static async saveToken(token: string) {
    await keytar.setPassword(PROGRAM_NAME, ACCOUNT_NAME, token);
  }

  static async getToken(): Promise<string | null> {
    return keytar.getPassword(PROGRAM_NAME, ACCOUNT_NAME);
  }

  static async isLoggedIn(): Promise<boolean> {
    const token = await Auth.getToken();
    return !!token;
  }

  static async logOut() {
    await keytar.deletePassword(PROGRAM_NAME, ACCOUNT_NAME);
  }
}
