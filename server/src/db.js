import pg from 'pg';
import { config } from './config.js';

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  // An idle client lost its connection; the pool replaces it automatically.
  console.error('PostgreSQL pool error:', err.message);
});

export const query = (text, params) => pool.query(text, params);
