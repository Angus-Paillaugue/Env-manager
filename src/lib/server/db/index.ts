import pg from 'pg';
import { env } from '$env/dynamic/private';
const { Pool } = pg;

const pool = new Pool({
	host: env.NODE_ENV === 'production' ? env.DB_HOST : 'localhost',
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
	port: 5432
});

export default pool;
