import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import pool, { init } from './db.js';

const SCENE_COUNT = 6;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateLetterBody(body) {
  const errors = [];
  if (!['id', 'en', 'kr'].includes(body.lang)) errors.push('lang must be one of id, en, kr');
  if (!isNonEmptyString(body.recipient)) errors.push('recipient is required');
  if (!isNonEmptyString(body.sender)) errors.push('sender is required');
  if (!isNonEmptyString(body.greeting)) errors.push('greeting is required');
  if (!isNonEmptyString(body.message)) errors.push('message is required');
  if (typeof body.quoteText !== 'string') errors.push('quoteText must be a string');
  if (typeof body.quoteAuthor !== 'string') errors.push('quoteAuthor must be a string');
  const sceneIndex = Number(body.sceneIndex);
  if (!Number.isInteger(sceneIndex) || sceneIndex < 0 || sceneIndex >= SCENE_COUNT) {
    errors.push(`sceneIndex must be an integer between 0 and ${SCENE_COUNT - 1}`);
  }
  return errors;
}

function rowToLetter(row) {
  return {
    id: row.id,
    lang: row.lang,
    recipient: row.recipient,
    sender: row.sender,
    greeting: row.greeting,
    message: row.message,
    quoteText: row.quote_text,
    quoteAuthor: row.quote_author,
    sceneIndex: row.scene_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'your-letter-api' });
});

router.post('/letters', async (req, res) => {
  const errors = validateLetterBody(req.body || {});
  if (errors.length) return res.status(400).json({ errors });

  const id = nanoid(8);
  const now = new Date().toISOString();
  const b = req.body;
  const result = await pool.query(
    `INSERT INTO letters (id, lang, recipient, sender, greeting, message, quote_text, quote_author, scene_index, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [id, b.lang, b.recipient, b.sender, b.greeting, b.message, b.quoteText, b.quoteAuthor, Number(b.sceneIndex), now, now]
  );

  res.status(201).json(rowToLetter(result.rows[0]));
});

router.get('/letters/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM letters WHERE id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Letter not found' });
  res.json(rowToLetter(result.rows[0]));
});

router.patch('/letters/:id', async (req, res) => {
  const existing = await pool.query('SELECT * FROM letters WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: 'Letter not found' });

  const errors = validateLetterBody(req.body || {});
  if (errors.length) return res.status(400).json({ errors });

  const b = req.body;
  const now = new Date().toISOString();
  const result = await pool.query(
    `UPDATE letters SET lang=$1, recipient=$2, sender=$3, greeting=$4,
       message=$5, quote_text=$6, quote_author=$7, scene_index=$8, updated_at=$9
     WHERE id=$10
     RETURNING *`,
    [b.lang, b.recipient, b.sender, b.greeting, b.message, b.quoteText, b.quoteAuthor, Number(b.sceneIndex), now, req.params.id]
  );

  res.json(rowToLetter(result.rows[0]));
});

const app = express();
app.use(cors());
app.use(express.json());
// Mounted at both prefixes so the same app works as a standalone server
// (behind the Vite "/api" dev proxy) and as a Netlify Function, which
// receives requests at its own "/.netlify/functions/api" path.
app.use('/api', router);
app.use('/.netlify/functions/api', router);

export { app, init };
