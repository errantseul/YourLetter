import { schedule } from '@netlify/functions';
import pool, { init } from '../../server/db.js';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Your Letter <onboarding@resend.dev>';
const SITE_URL = process.env.URL || process.env.DEPLOY_URL || '';

const SUBJECT = {
  id: (sender) => `💌 Surat dari ${sender} untukmu`,
  en: (sender) => `💌 A letter from ${sender} for you`,
  kr: (sender) => `💌 ${sender}가 보낸 편지가 도착했어요`,
};

const INTRO = {
  id: 'Kamu menerima sebuah surat. Klik tombol di bawah untuk membacanya:',
  en: "You've received a letter. Click the button below to read it:",
  kr: '편지가 도착했어요. 아래 버튼을 눌러 읽어보세요:',
};

const READ_BUTTON = {
  id: 'Baca Suratnya',
  en: 'Read the Letter',
  kr: '편지 읽기',
};

function emailHtml(lang, link) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <p>${INTRO[lang]}</p>
      <p style="margin: 24px 0;">
        <a href="${link}" style="background:#F5896F;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:600;">${READ_BUTTON[lang]}</a>
      </p>
      <p style="color:#888;font-size:13px;">${link}</p>
    </div>
  `;
}

async function sendDueLetters() {
  await init();
  const now = new Date().toISOString();
  const due = await pool.query(
    `SELECT id, lang, sender, recipient_email FROM letters
     WHERE send_at IS NOT NULL AND sent_at IS NULL AND send_at <= $1`,
    [now]
  );

  let sent = 0;
  for (const row of due.rows) {
    const lang = ['id', 'en', 'kr'].includes(row.lang) ? row.lang : 'id';
    const link = `${SITE_URL}/s/${row.id}`;
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: row.recipient_email,
          subject: SUBJECT[lang](row.sender),
          html: emailHtml(lang, link),
        }),
      });
      if (!res.ok) {
        console.error(`Failed to send letter ${row.id}:`, res.status, await res.text().catch(() => ''));
        continue;
      }
      await pool.query('UPDATE letters SET sent_at = $1 WHERE id = $2', [new Date().toISOString(), row.id]);
      sent += 1;
    } catch (err) {
      console.error(`Error sending letter ${row.id}:`, err.message);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ checked: due.rows.length, sent }) };
}

export const handler = schedule('*/10 * * * *', sendDueLetters);
