import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en'],
    load: 'languageOnly',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/scumdb/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  }).then(() => {
    console.log('%cNEXT SCUM', 'color: #00e676; font-size: 24px; font-weight: bold;');
    console.log('%cС любовью к SCUM комьюнити ❤️', 'color: #ff5722; font-size: 16px;');
  });

export default i18n; 