import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './data/translations';

// i18next expects resources to be nested under a default namespace (usually 'translation')
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = { translation: translations[lang] };
  return acc;
}, {});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
