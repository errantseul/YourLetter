import { createContext, useContext, useMemo, useState } from 'react';
import { strings } from './data/strings.js';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'your-letter:lang';

function initialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en' || stored === 'kr') return stored;
  } catch {
    // ignore
  }
  return 'id';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = (next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
