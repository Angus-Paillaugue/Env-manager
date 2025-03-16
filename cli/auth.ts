import axios from 'axios';
import fs from 'fs-extra';
import { API_URL, CONFIG_PATH } from './contants';

export class Auth {
	static async login(email: string, password: string) {
		try {
			const response = await axios.post(`${API_URL}/authenticate`, { email, password });
			const token = response.data.token;
			Auth.saveToken(token);
		} catch (error) {
			throw new Error(error.response?.data?.error || error.message);
		}
	}

	static saveToken(token: string) {
		fs.ensureFileSync(CONFIG_PATH);
		fs.writeJsonSync(CONFIG_PATH, { token }, { spaces: 2 });
	}

	static getToken(): string | null {
		if (!fs.existsSync(CONFIG_PATH)) return null;
		return fs.readJsonSync(CONFIG_PATH).token;
	}

	static isLoggedIn(): boolean {
		return !!Auth.getToken();
	}
}
