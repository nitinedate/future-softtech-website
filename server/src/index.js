import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { pool } from './db.js';
import { authRouter } from './routes/auth.js';

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(here, '../../client/dist');

app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);

// Strict security headers for the React site and API. The older company
// presentation page relies on an inline script, so it gets a relaxed policy.
const strictHeaders = helmet();
const presentationHeaders = helmet({ contentSecurityPolicy: false });
app.use((req, res, next) =>
  req.path === '/future_softtech_ppt.html'
    ? presentationHeaders(req, res, next)
    : strictHeaders(req, res, next),
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: 'connected' });
});

app.use('/api/auth', authRouter);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'This API route does not exist.' });
});

// In production the built React app is served from the same origin as the API,
// so the session cookie works without any CORS configuration.
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '1h', index: false }));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  const dbDown = ['ECONNREFUSED', '57P01', '3D000', '28P01'].includes(err.code);
  res.status(dbDown ? 503 : 500).json({
    error: dbDown
      ? 'The sign-in service cannot reach its database. Try again in a few minutes.'
      : 'Something went wrong on our side. Try again in a few minutes.',
  });
});

app.listen(config.port, () => {
  console.log(`Future SoftTech server running at http://localhost:${config.port}`);
  if (!fs.existsSync(clientDist)) {
    console.log('API only: run "npm run build" in client/ to serve the website from here.');
  }
});
