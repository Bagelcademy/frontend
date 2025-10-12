import React from 'react';
import { BookOpen, UserCheck } from 'lucide-react';
import CounterCard from './CounterCard';
import { useTranslation } from 'react-i18next';

const CounterSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CounterCard
              icon={BookOpen}
              value={100}
              label={t('Active Courses')}
              bgImage="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Faf240937-9a88-47d2-9a12-66b5abb6e206.png"
              gradient="bg-gradient-to-r from-blue-600/90 to-blue-800/90"
            />
            <CounterCard
              icon={UserCheck}
              value={400}
              label={t('Active Users')}
              bgImage="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Faf240937-9a88-47d2-9a12-66b5abb6e206.png"
              gradient="bg-gradient-to-r from-purple-600/90 to-purple-800/90"
            />
          </div>
        </div>
      </div>
  );
};

export default CounterSection;
