import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black bg-white ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-black dark:text-white mb-4 animate-pulse">404</h1>
        <p className="text-2xl text-white mb-8">{t('Oops! Page not found')}</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="bg-transparent text-gray-500 dark:text-white px-6 py-3 rounded-full font-semibold inline-flex items-center border border-white hover:bg-gray hover:text-black  ml-4"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('Go Home')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent text-gray-500 px-6 py-3 dark:text-white rounded-full font-semibold inline-flex items-center border border-white hover:bg-gray hover:text-black  ml-4"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            {t('Go Back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
