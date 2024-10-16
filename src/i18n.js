import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '../public/locales/en/translation.json'; 
import translationFA from '../public/locales/fa/translation.json';  // Correct the 'fa' identifier

const resources = {
  en: {
    translation: translationEN,
  },
  fa: {
    translation: translationFA,  // Persian (RTL) language
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
