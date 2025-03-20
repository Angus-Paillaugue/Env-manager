import { join } from 'path';

export const API_URL = process.env.DEVELOPEMENT ? 'http://localhost:5173/api' : 'PROD_API_URL'; // Change to your backend URL
export const CONFIG_PATH = join(process.env.HOME || '', '.env-manager/config.json');
