// Creates the users and sessions tables. Safe to run more than once.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.resolve(here, '../db/schema.sql'), 'utf8');

try {
  await pool.query(schema);
  console.log('Database is ready: users and sessions tables exist.');
  console.log('Next, create a client account with: npm run user:create');
} catch (err) {
  console.error('Could not set up the database.');
  console.error(err.code === '3D000'
    ? 'The database in DATABASE_URL does not exist yet. Create it first, for example: createdb future_softtech'
    : err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
