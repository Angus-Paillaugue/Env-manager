import { Auth } from '../auth';
import http from 'http';
import open from 'open';
import { randomUUID } from 'crypto';
import { ConfigManager } from '../config';

async function auth() {
	const state = randomUUID();

	const server = http.createServer((req, res) => {
		if (req.url.startsWith('/auth/callback')) {
			const url = new URL(req.url, 'http://localhost:3001');
			const token = url.searchParams.get('token');

			if (token) {
				Auth.saveToken(token);
				res.end('Authentication successful!');
				server.close();
			} else {
				res.end('Authentication failed.');
			}
		}
	});

	server.listen(3001, () => console.log('Waiting for authentication...'));

	// Open browser for authentication
	const config = ConfigManager.getConfig();
	await open(`${config.frontendUrl}/auth/callback?state=${state}`);

	console.log('Please complete authentication in your browser.');
}

export async function login() {
	if (await Auth.getToken()) {
		console.log('You are already logged in');
	} else {
		await auth();

		console.log('Login process completed.');
	}
}
