import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/api/letters', (req, res) => {
  const errors = validateLetterBody(req.body || {});
  if (errors.length) return res.status(400).json({ errors });

  const id = nanoid(8);
  const now = new Date().toISOString();
  const b = req.body;
  db.prepare(
    `INSERT INTO letters (id, lang, recipient, sender, greeting, message, quote_text, quote_author, scene_index, created_at, updated_at)
     VALUES (@id, @lang, @recipient, @sender, @greeting, @message, @quoteText, @quoteAuthor, @sceneIndex, @createdAt, @updatedAt)`
  ).run({
    id,
    lang: b.lang,
    recipient: b.recipient,
    sender: b.sender,
    greeting: b.greeting,
    message: b.message,
    quoteText: b.quoteText,
    quoteAuthor: b.quoteAuthor,
    sceneIndex: Number(b.sceneIndex),
    createdAt: now,
    updatedAt: now,
  });

  const row = db.prepare('SELECT * FROM letters WHERE id = ?').get(id);
  res.status(201).json(rowToLetter(row));
});

app.get('/api/letters/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM letters WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Letter not found' });
  res.json(rowToLetter(row));
});

app.patch('/api/letters/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM letters WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Letter not found' });

  const errors = validateLetterBody(req.body || {});
  if (errors.length) return res.status(400).json({ errors });

  const b = req.body;
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE letters SET lang=@lang, recipient=@recipient, sender=@sender, greeting=@greeting,
       message=@message, quote_text=@quoteText, quote_author=@quoteAuthor, scene_index=@sceneIndex, updated_at=@updatedAt
     WHERE id=@id`
  ).run({
    id: req.params.id,
    lang: b.lang,
    recipient: b.recipient,
    sender: b.sender,
    greeting: b.greeting,
    message: b.message,
    quoteText: b.quoteText,
    quoteAuthor: b.quoteAuthor,
    sceneIndex: Number(b.sceneIndex),
    updatedAt: now,
  });

  const row = db.prepare('SELECT * FROM letters WHERE id = ?').get(req.params.id);
  res.json(rowToLetter(row));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Your Letter API listening on http://localhost:${PORT}`);
});
