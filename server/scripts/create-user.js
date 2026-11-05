// Creates a client account, or resets the password of an existing one.
//
//   npm run user:create
//   npm run user:create -- --email client@example.com --name "Asha Rao"
//
// The password is always typed at a hidden prompt so it never lands in shell
// history. For automated setups you can set NEW_USER_PASSWORD instead.
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db.js';

function readArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--email') args.email = argv[++i];
    else if (argv[i] === '--name') args.name = argv[++i];
  }
  return args;
}

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (text) => {
        if (text.includes(question)) rl.output.write(text);
        else if (text === '\r\n' || text === '\n') rl.output.write(text);
        else rl.output.write('*');
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

const args = readArgs();
const email = (args.email || (await ask('Client email: '))).toLowerCase();
const fullName = args.name || (await ask('Full name: '));

if (!email.includes('@') || email.startsWith('@')) {
  console.error('Enter a valid email address.');
  process.exit(1);
}
if (!fullName) {
  console.error('Enter the client\'s full name.');
  process.exit(1);
}

let password = process.env.NEW_USER_PASSWORD;
if (!password) {
  password = await ask('Password (at least 10 characters): ', { hidden: true });
  const confirm = await ask('Type the password again: ', { hidden: true });
  if (password !== confirm) {
    console.error('The two passwords do not match. Nothing was saved.');
    process.exit(1);
  }
}
if (password.length < 10) {
  console.error('Use a password with at least 10 characters. Nothing was saved.');
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (email, full_name, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            password_hash = EXCLUDED.password_hash,
            is_active = TRUE
     RETURNING id, (xmax = 0) AS inserted`,
    [email, fullName, hash],
  );
  if (!rows[0].inserted) {
    // A password reset should sign the account out everywhere.
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [rows[0].id]);
  }
  console.log(rows[0].inserted
    ? `Created account for ${email}. They can now sign in.`
    : `Updated ${email} with the new password and signed it out of all browsers.`);
} catch (err) {
  console.error(err.code === '42P01'
    ? 'The users table does not exist yet. Run: npm run db:init'
    : `Could not save the account: ${err.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
