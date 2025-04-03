import { randomUUID } from 'crypto';
import http from 'http';
import open from 'open';
import { Auth } from '../auth';
import { ConfigManager } from '../config';
import { log } from '../utils/logger';

async function auth() {
  const state = randomUUID();

  const server = http.createServer((req, res) => {
    if (req.url?.startsWith('/auth/callback')) {
      const url = new URL(req.url, 'http://localhost:3001');
      const token = url.searchParams.get('token');

      if (token) {
        Auth.saveToken(token);
        res.end('Authentication successful!');
        log.success('Authentication successful!');
        server.close();
      } else {
        res.end('Authentication failed.');
        log.error('Authentication failed.');
      }
    }
  });

  server.listen(3001, () => log.info('Waiting for authentication...'));

  // Open browser for authentication
  const config = await ConfigManager.getConfig();
  await open(`${config.frontendUrl}/auth/callback?state=${state}`);

  log.info('Please complete authentication in your browser.');
}

export async function login() {
  if (await Auth.getToken()) {
    log.info('You are already logged in');
  } else {
    await auth();
    log.success('Login process completed.');
  }
}
