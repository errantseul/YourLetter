import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'letters.db'));

db.pragma('journal_mode = WAL');

db.exec(`
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

export default db;
