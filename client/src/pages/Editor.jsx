import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Postcard from '../components/Postcard.jsx';
import { scenes, makeScene } from '../data/scenes.js';
import { quotes } from '../data/quotes.js';
import { greetingFor } from '../data/strings.js';
import { createLetter, getLetter, updateLetter } from '../api.js';
import './Editor.css';

const emptyDraft = { to: '', from: '', message: '', quoteText: '', quoteAuthor: '' };

export default function Editor() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [draft, setDraft] = useState(emptyDraft);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [status, setStatus] = useState(id ? 'loading' : 'ready');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setDraft(emptyDraft);
      setSceneIndex(0);
      setStatus('ready');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    getLetter(id)
      .then((letter) => {
        if (cancelled) return;
        setDraft({
          to: letter.recipient,
          from: letter.sender,
          message: letter.message,
          quoteText: letter.quoteText,
          quoteAuthor: letter.quoteAuthor,
        });
        setSceneIndex(letter.sceneIndex);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('not-found');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const set = (key) => (e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }));

  const cardTo = draft.to || t.fbTo;
  const card = {
    greeting: greetingFor(cardTo, lang),
    sender: draft.from || t.fbFrom,
    message: draft.message || t.fbMessage,
    quoteText: draft.quoteText || t.fbQuote,
    quoteAuthor: draft.quoteText ? draft.quoteAuthor : '',
  };
  const scene = useMemo(() => makeScene(sceneIndex, lang), [sceneIndex, lang]);

  const randomQuote = () => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setDraft((prev) => ({ ...prev, quoteText: q[lang], quoteAuthor: t.anon }));
  };

  const randomScene = () => {
    let i = sceneIndex;
    if (scenes.length > 1) {
      while (i === sceneIndex) i = Math.floor(Math.random() * scenes.length);
    }
    setSceneIndex(i);
  };

  const submit = async () => {
    setSaving(true);
    const payload = {
      lang,
      recipient: cardTo,
      sender: card.sender,
      greeting: card.greeting,
      message: card.message,
      quoteText: card.quoteText,
      quoteAuthor: card.quoteAuthor,
      sceneIndex,
    };
    try {
      const saved = id ? await updateLetter(id, payload) : await createLetter(payload);
      navigate(`/preview/${saved.id}`);
    } catch (e) {
      setSaving(false);
      alert(e.message);
    }
  };

  if (status === 'loading') {
    return (
      <div className="editor-status">
        <p>{t.loading}</p>
      </div>
    );
  }
  if (status === 'not-found') {
    return (
      <div className="editor-status">
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}</p>
      </div>
    );
  }

  return (
    <div className="editor">
      <h2 className="editor-title">{t.edTitle}</h2>
      <p className="editor-subtitle">{t.edSubtitle}</p>

      <div className="editor-grid">
        <div className="editor-form">
          <div className="editor-row-2">
            <div>
              <label className="field-label">{t.lblTo}</label>
              <input className="field-input" value={draft.to} onChange={set('to')} placeholder={t.phTo} />
            </div>
            <div>
              <label className="field-label">{t.lblFrom}</label>
              <input className="field-input" value={draft.from} onChange={set('from')} placeholder={t.phFrom} />
            </div>
          </div>

          <div>
            <label className="field-label">{t.lblMessage}</label>
            <textarea
              className="field-input editor-message"
              value={draft.message}
              onChange={set('message')}
              placeholder={t.phMessage}
              rows={5}
            />
          </div>

          <div>
            <div className="editor-field-header editor-field-header--quote">
              <label className="field-label" style={{ margin: 0 }}>{t.lblQuote}</label>
              <button type="button" className="chip-btn" onClick={randomQuote}>{t.btnRandQuote}</button>
            </div>
            <textarea
              className="field-input quote-input"
              value={draft.quoteText}
              onChange={set('quoteText')}
              placeholder={t.phQuote}
              rows={2}
            />
          </div>

          <div>
            <div className="editor-field-header">
              <label className="field-label" style={{ margin: 0 }}>{t.lblScene}</label>
              <button type="button" className="chip-btn" onClick={randomScene}>{t.btnRandScene}</button>
            </div>
            <div className="editor-scenes">
              {scenes.map((s, i) => {
                const active = i === sceneIndex;
                return (
                  <button
                    type="button"
                    key={i}
                    className={'editor-scene-tile' + (active ? ' is-active' : '')}
                    onClick={() => setSceneIndex(i)}
                  >
                    <div
                      className="editor-scene-thumb"
                      style={{ background: `linear-gradient(160deg, ${s.skyTop}, ${s.skyMid}, ${s.skyBottom})` }}
                    />
                    <div className="editor-scene-label">
                      {s.emoji} {s.names[lang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="button" className="btn btn-primary editor-submit" onClick={submit} disabled={saving}>
            {t.btnToPreview}
          </button>
        </div>

        <div className="editor-preview">
          <div className="editor-preview-label">{t.livePreview}</div>
          <Postcard {...card} scene={scene} bandH="200px" />
        </div>
      </div>
    </div>
  );
}
