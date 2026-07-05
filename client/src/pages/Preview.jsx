import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Postcard from '../components/Postcard.jsx';
import { makeScene } from '../data/scenes.js';
import { getLetter } from '../api.js';
import './Preview.css';

export default function Preview() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [letter, setLetter] = useState(null);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="preview-status">
        <p>{t.loading}</p>
      </div>
    );
  }
  if (status === 'not-found') {
    return (
      <div className="preview-status">
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}</p>
      </div>
    );
  }

  const link = `${window.location.origin}/s/${id}`;
  const scene = makeScene(letter.sceneIndex, lang);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // ignore — clipboard may be unavailable
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview">
      <h2 className="preview-title">{t.pvTitle}</h2>
      <p className="preview-subtitle">{t.pvSubtitle}</p>

      <Postcard
        greeting={letter.greeting}
        sender={letter.sender}
        message={letter.message}
        quoteText={letter.quoteText}
        quoteAuthor={letter.quoteAuthor}
        scene={scene}
        bandH="240px"
      />

      <div className="preview-share">
        <label className="field-label">{t.lblLink}</label>
        <div className="preview-link-row">
          <input className="field-input preview-link-input" value={link} readOnly />
          <button type="button" className="btn btn-copy" onClick={copyLink}>
            {copied ? t.btnCopyDone : t.btnCopyIdle}
          </button>
        </div>
        <div className="preview-actions">
          <button type="button" className="btn btn-ghost preview-action" onClick={() => navigate(`/s/${id}`)}>
            {t.btnOpen}
          </button>
          <button type="button" className="btn btn-ghost preview-action" onClick={() => navigate(`/write/${id}`)}>
            {t.btnEdit}
          </button>
        </div>
      </div>
    </div>
  );
}
