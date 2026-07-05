import pg from 'pg';

const { Pool } = pg;

// Checked in order: a manual DATABASE_URL (plain `node` local dev),
// Netlify Database's own NETLIFY_DB_URL (if it ever does get injected),
// then PG_CONNECTION_STRING — a plain custom-named variable set by hand
// in the Netlify dashboard, which sidesteps Netlify Database's rough
// edges (its env var isn't reliably injected into Functions, and its
// @netlify/database package fails to bundle in this repo's layout).
const connectionString =
  process.env.DATABASE_URL || process.env.NETLIFY_DB_URL || process.env.PG_CONNECTION_STRING;
const isLocalDb = /localhost|127\.0\.0\.1/.test(connectionString || '');

const pool = new Pool({
  connectionString,
  ssl: isLocalDb ? false : { rejectUnauthorized: false },
});

export async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS letters (
      id TEXT PRIMARY KEY,
      lang TEXT NOT NULL,
      recipient TEXT NOT NULL,
      sender TEXT NOT NULL,
      greeting TEXT NOT NULL,
      message TEXT NOT NULL,
      quote_text TEXT NOT NULL,
      quote_author TEXT NOT NULL,
      scene_index INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  // Added for scheduled email delivery; IF NOT EXISTS keeps this safe to
  // rerun against a database created before these columns existed.
  await pool.query(`
    ALTER TABLE letters
      ADD COLUMN IF NOT EXISTS recipient_email TEXT,
      ADD COLUMN IF NOT EXISTS send_at TEXT,
      ADD COLUMN IF NOT EXISTS sent_at TEXT
  `);
}

export default pool;
