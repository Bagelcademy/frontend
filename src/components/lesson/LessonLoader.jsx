import React from 'react';
import { useTranslation } from 'react-i18next';

const LessonLoader = ({ isNextLesson = false }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50">
    <div className="bg-white dark:bg-slate-800 rounded-lg p-8 flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
        {isNextLesson ? t('Loading next lesson...') : t('Loading lesson...')}
      </p>
    </div>
  </div>
);
};

export default LessonLoader;