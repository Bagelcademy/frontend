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
    fallbackLng: 'fa', // Default to Persian
    lng: 'fa', // Set Persian as the initial language
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // Allows raw HTML in translations
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
