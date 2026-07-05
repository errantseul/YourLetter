import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Postcard from '../components/Postcard.jsx';
import { makeScene } from '../data/scenes.js';
import { greetingFor } from '../data/strings.js';
import './Landing.css';

export default function Landing() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const sampleScene = makeScene(1, lang);
  const sampleCard = {
    greeting: greetingFor(t.sampTo, lang),
    sender: t.sampFrom,
    message: t.sampMessage,
    quoteText: t.sampQuote,
    quoteAuthor: t.anon,
  };

  return (
    <div className="landing">
      <div className="landing-copy">
        <h1 className="landing-title">
          Your <span className="landing-title-accent">Letter</span>
        </h1>
        <p className="landing-tagline">{t.heroTagline}</p>
        <div className="landing-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/write')}>
            {t.btnStart}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/s/sample')}>
            {t.btnSample}
          </button>
        </div>
        <div className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature-icon">💬</span> {t.feat1}
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">🔗</span> {t.feat2}
          </div>
        </div>
      </div>
      <div className="landing-sample">
        <div className="landing-sample-card">
          <Postcard {...sampleCard} scene={sampleScene} bandH="196px" />
        </div>
      </div>
    </div>
  );
}
