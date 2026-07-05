import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Postcard from '../components/Postcard.jsx';
import { makeScene } from '../data/scenes.js';
import { greetingFor } from '../data/strings.js';
import { getLetter } from '../api.js';
import './Read.css';

function sampleLetter(t, lang) {
  return {
    greeting: greetingFor(t.sampTo, lang),
    sender: t.sampFrom,
    message: t.sampMessage,
    quoteText: t.sampQuote,
    quoteAuthor: t.anon,
    sceneIndex: 1,
  };
}

export default function Read() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const isSample = id === 'sample';
  const [letter, setLetter] = useState(isSample ? sampleLetter(t, lang) : null);
  const [status, setStatus] = useState(isSample ? 'ready' : 'loading');

  useEffect(() => {
    if (isSample) {
      setLetter(sampleLetter(t, lang));
      setStatus('ready');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    getLetter(id)
      .then((data) => {
        if (!cancelled) {
          setLetter(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('not-found');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isSample]);

  if (status === 'loading') {
    return (
      <div className="read-status">
        <p>{t.loading}</p>
      </div>
    );
  }
  if (status === 'not-found') {
    return (
      <div className="read-status">
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}</p>
      </div>
    );
  }

  const scene = makeScene(letter.sceneIndex, lang);

  return (
    <div className="read">
      <div className="read-badge-row">
        <div className="read-badge">{t.rdBadge}</div>
      </div>
      <div className="read-postcard">
        <Postcard
          greeting={letter.greeting}
          sender={letter.sender}
          message={letter.message}
          quoteText={letter.quoteText}
          quoteAuthor={letter.quoteAuthor}
          scene={scene}
          bandH="250px"
        />
      </div>
      <div className="read-actions">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/write')}>
          {t.btnReply}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
          {t.btnHome}
        </button>
      </div>
    </div>
  );
}
