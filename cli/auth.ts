import axios from 'axios';
import keytar from 'keytar';
import { API_URL } from './constants';

const SERVICE_NAME = 'env-manager';
const ACCOUNT_NAME = 'auth-token';

export class Auth {
	static async login(email: string, password: string, totpCode?: string) {
		try {
			const response = await axios.post(`${API_URL}/authenticate`, { email, password, totpCode });
			const token = response.data.token;
			Auth.saveToken(token);
			return token;
		} catch (error) {
			throw new Error(error.response?.data?.error || error.message);
		}
	}

	static async saveToken(token: string) {
		await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
	}

	static async getToken(): Promise<string | null> {
		return keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
	}

	static async isLoggedIn(): Promise<boolean> {
		const token = await Auth.getToken();
		return !!token;
	}

	static async logOut() {
		await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
	}
}
