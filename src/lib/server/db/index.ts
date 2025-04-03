import { env } from '$env/dynamic/private';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: parseInt(env.POSTGRES_PORT ?? '', 10) || 5432
});

export default pool;
