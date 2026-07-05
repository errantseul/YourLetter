import pg from 'pg';

const { Pool } = pg;

const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
}

export default pool;
