# Future SoftTech website

A React website with a working client login backed by PostgreSQL.

- **Front end:** React 19 and React Router, built with Vite (`client/`)
- **Back end:** Node.js and Express (`server/`)
- **Database:** PostgreSQL 13 or newer (tables in `server/db/schema.sql`)

The header (logo, menu and login button) is fixed: it stays in place at the top of the screen while the page scrolls underneath.

## What you need

- Node.js 20 or newer: https://nodejs.org
- PostgreSQL 13 or newer: https://www.postgresql.org/download

## Start on Windows with CMD

After installing Node.js 20+ and PostgreSQL 13+, create a PostgreSQL database named `future_softtech`, then double-click `run-future-softtech.cmd`. On the first run it creates `server/.env` from the example and opens it so you can set your PostgreSQL password. Save the file and run the script again. The script installs missing packages, initializes the tables, and starts the site at http://localhost:5173.

To create a client account, open CMD in this folder and run `npm run user:create` once for each account.

## Set up (first time only)

Run every command from this folder (the one containing this README).

**1. Install the packages**

```
npm run install:all
```

**2. Create the database**

Using the `psql` tool that comes with PostgreSQL:

```
psql -U postgres -c "CREATE DATABASE future_softtech;"
```

You can also create a database named `future_softtech` in pgAdmin.

**3. Add your database settings**

Copy the example settings file:

```
# macOS / Linux
cp server/.env.example server/.env

# Windows (Command Prompt)
copy server\.env.example server\.env
```

Open `server/.env` and set `DATABASE_URL` to your PostgreSQL user, password and database, for example:

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/future_softtech
```

**4. Create the tables**

```
npm run db:init
```

This is safe to run again; it never deletes data.

**5. Create a client account**

There is no public sign-up page. Your team creates each client's account:

```
npm run user:create
```

You'll be asked for the client's email, full name and a password (at least 10 characters, typed hidden). Running it again with the same email resets that password and signs the account out of every browser.

## Run the website

**While developing**

```
npm run dev
```

Open http://localhost:5173. Changes to the code appear instantly.

**In production**

```
npm run build
npm start
```

Open http://localhost:4000. Express serves the website and the API from the same address.

## Commands

| Command | What it does |
| --- | --- |
| `npm run install:all` | Installs packages for the root, server and client |
| `npm run dev` | Runs the API (port 4000) and website (port 5173) together |
| `npm run build` | Builds the website into `client/dist` |
| `npm start` | Runs the server and serves the built website on port 4000 |
| `npm run db:init` | Creates the `users` and `sessions` tables |
| `npm run user:create` | Creates a client account or resets its password |

## Pages

| Address | Page |
| --- | --- |
| `/` | Home |
| `/about` | About, values and leadership |
| `/services` | Services and the four-step way of working |
| `/projects` | Selected projects |
| `/contact` | Contact form (opens an email draft) and contact details |
| `/login` | Client sign-in |
| `/workspace` | Signed-in area; visitors who aren't signed in are sent to `/login` |
| `/future_softtech_ppt.html` | The original company presentation, unchanged |

## How the login works

1. The client enters their email and password on `/login`.
2. The server looks up the email in the `users` table and checks the password against its bcrypt hash.
3. If it matches, the server creates a row in the `sessions` table and sends a session cookie to the browser.
4. Each page load asks `/api/auth/me` who is signed in. The header button changes from **Client login** to **Your workspace**.
5. **Sign out** deletes the session row, so the cookie stops working immediately.

### API

| Method | Address | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in. JSON body: `{ "email", "password", "remember" }` |
| `GET` | `/api/auth/me` | Returns `{ "user": {...} }`, or `{ "user": null }` when not signed in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/health` | Checks the server can reach the database |

### Security built in

- Passwords are stored only as bcrypt hashes (cost 12), never as plain text.
- The session cookie is `httpOnly` (page scripts can't read it) and `SameSite=Lax`. It is HTTPS-only when `NODE_ENV=production`.
- Only a SHA-256 hash of each session token is stored, so a database leak doesn't expose working sessions.
- Sign-in is limited to 10 failed attempts per 15 minutes from one address.
- A wrong email and a wrong password get the same message and take the same time, so the form doesn't reveal which emails have accounts.
- The login endpoint only accepts JSON, which blocks cross-site form submissions.
- Security headers (including a Content Security Policy) are set with Helmet.

"Keep me signed in" keeps a client signed in for 30 days. Otherwise the session ends when the browser closes, and after 12 hours at most.

### Adding a protected API route

Use the `requireAuth` middleware; the signed-in user is then available as `req.user`:

```js
import { requireAuth } from '../middleware/requireAuth.js';

router.get('/projects', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT ... WHERE client_id = $1', [req.user.id]);
  res.json(rows);
});
```

## Project structure

```
client/
  public/                 favicon, original presentation (copied as-is)
  src/
    assets/images/        logo and photos
    components/           Header (fixed), Footer, Layout, diamond imagery
    context/AuthContext   keeps track of who is signed in
    lib/api.js            calls the Express API
    pages/                one file per page
    styles/app.css        all styles: colours, fonts, sizes, layout
server/
  db/schema.sql           PostgreSQL tables
  scripts/                db:init and user:create
  src/
    index.js              Express app
    routes/auth.js        login, me, logout
    sessions.js           session create / find / delete
    middleware/           requireAuth
```

## Changing the look

All design settings are at the top of `client/src/styles/app.css`:

- **Colours:** `--navy`, `--cobalt` and `--sky` come from the logo.
- **Fonts:** Zilla Slab for headings (it matches the logo's lettering) and Hanken Grotesk for text. Both are bundled with the site, so no external font service is used.
- **Text sizes:** body text is 18px on desktop and nothing is smaller than 15px. Change `--text-base`, `--text-h1-hero` and the other `--text-*` values to adjust.
- **Header height:** `--header-h` (84px on desktop, 72px on phones). Page content is offset by exactly this amount, so it never hides behind the fixed header.

## Going live

- Set `NODE_ENV=production` in `server/.env`, and serve the site over HTTPS. The session cookie is HTTPS-only in production, so sign-in will not work over plain `http://`.
- If the app runs behind Nginx or a hosting platform such as Render or Railway, set `TRUST_PROXY=true`.
- For a hosted database that requires SSL, add `?sslmode=require` to the end of `DATABASE_URL`.
