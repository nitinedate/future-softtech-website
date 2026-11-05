-- Future SoftTech client portal schema (PostgreSQL 13+)
-- Safe to run more than once: every statement is idempotent.

CREATE TABLE IF NOT EXISTS users (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email             TEXT        NOT NULL,
  full_name         TEXT        NOT NULL,
  password_hash     TEXT        NOT NULL,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at     TIMESTAMPTZ,
  previous_login_at TIMESTAMPTZ,
  -- Emails are stored lower-case so the unique index is case-insensitive.
  CONSTRAINT users_email_lowercase CHECK (email = lower(email)),
  CONSTRAINT users_email_shape     CHECK (position('@' IN email) > 1),
  CONSTRAINT users_name_present    CHECK (length(btrim(full_name)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (email);

-- One row per signed-in browser. Only a SHA-256 hash of the session token is
-- stored, so a database leak does not expose usable session cookies.
CREATE TABLE IF NOT EXISTS sessions (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  BYTEA       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  user_agent  TEXT,
  ip_address  INET
);

CREATE UNIQUE INDEX IF NOT EXISTS sessions_token_hash_key ON sessions (token_hash);
CREATE INDEX        IF NOT EXISTS sessions_user_id_idx    ON sessions (user_id);
CREATE INDEX        IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);
