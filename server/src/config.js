import 'dotenv/config';

const required = ['DATABASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Copy server/.env.example to server/.env and fill it in.`);
    process.exit(1);
  }
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  isProduction: process.env.NODE_ENV === 'production',
  trustProxy: process.env.TRUST_PROXY === 'true',
  session: {
    cookieName: 'fs_session',
    // "Keep me signed in" lasts 30 days; otherwise the session ends after 12 hours.
    shortTtlMs: 12 * 60 * 60 * 1000,
    longTtlMs: 30 * 24 * 60 * 60 * 1000,
  },
};
