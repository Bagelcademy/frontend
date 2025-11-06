import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LessonTabs = ({ tabs, activeTab, setActiveTab, handleBack }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed top-20 left-0 right-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 z-40">
    <div className="mx-auto px-0">
            <div className="fixed sm:top-28 top-36 left-4 z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('Back to Course')}
              </Button>
            </div>
      <div className="flex items-center justify-center h-20">
        <div className="flex items-center gap-4">
          {tabs.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => setActiveTab(id)}
              className={activeTab === id ? 'text-blue-500 bg-gray-300 dark:text-blue-400 dark:bg-gray-600' : 'text-gray-700 bg-gray-300 dark:text-gray-200 dark:bg-gray-600'}
            >
              <Icon className="w-5 h-5" />
              <span className="mx-2 hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>

);
};

export default LessonTabs;