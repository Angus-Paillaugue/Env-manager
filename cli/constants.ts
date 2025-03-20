import { join } from 'path';

export const FRONTEND_URL = process.env.DEVELOPEMENT
	? 'http://localhost:5173'
	: process.env.FRONTEND_URL;
export const API_URL = FRONTEND_URL + '/api';
export const CONFIG_PATH = join(process.env.HOME || '', '.env-manager/config.json');
