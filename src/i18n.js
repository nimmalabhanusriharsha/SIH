import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './data/translations';

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
