import { NavLink } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import './Header.css';

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <>
      <nav className="nav-pill">
        <NavLink to="/" end className={({ isActive }) => 'nav-pill-btn' + (isActive ? ' is-active' : '')}>
          {t.navHome}
        </NavLink>
        <NavLink to="/write" className={({ isActive }) => 'nav-pill-btn' + (isActive ? ' is-active' : '')}>
          {t.navWrite}
        </NavLink>
      </nav>

      <div className="lang-pill">
        {['id', 'en', 'kr'].map((code) => (
          <button
            key={code}
            type="button"
            className={'lang-pill-btn' + (lang === code ? ' is-active' : '')}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}
