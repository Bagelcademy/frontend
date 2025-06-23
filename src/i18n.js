import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ✅ Correct JSON imports from src/locales
import translationEN from '../public/locales/en/translation.json';
import translationFA from '../public/locales/fa/translation.json';

const resources = {
  en: { translation: translationEN },
  fa: { translation: translationFA }, // Persian (RTL)
};

i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind i18n to React
  .init({
    resources,
    fallbackLng: 'en', // fallback if nothing is found
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
