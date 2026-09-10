import { translations } from './data/translations';

// Lightweight i18n adapter backed by KisanQueue translations system
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = { translation: translations[lang] };
  return acc;
}, {});

let currentLanguage = 'en';
const listeners = new Set();

const i18n = {
  language: currentLanguage,
  languages: Object.keys(translations),
  options: {
    resources,
    fallbackLng: 'en',
  },
  changeLanguage: (lang) => {
    if (translations[lang]) {
      currentLanguage = lang;
      i18n.language = lang;
      listeners.forEach((fn) => fn(lang));
      return Promise.resolve(lang);
    }
    return Promise.reject(new Error(`Language ${lang} not supported`));
  },
  t: (key, paramsOrFallback = {}) => {
    let params = typeof paramsOrFallback === 'object' ? paramsOrFallback : {};
    let text = translations[currentLanguage]?.[key] || translations.en?.[key] || (typeof paramsOrFallback === 'string' ? paramsOrFallback : key);
    if (params && typeof text === 'string') {
      Object.keys(params).forEach((paramKey) => {
        const doubleRegex = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g');
        text = text.replace(doubleRegex, String(params[paramKey]));
      });
    }
    return text;
  },
  on: (event, callback) => {
    if (event === 'languageChanged') {
      listeners.add(callback);
    }
  },
  off: (event, callback) => {
    if (event === 'languageChanged') {
      listeners.delete(callback);
    }
  }
};

export default i18n;

