import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const CertificateModal = ({ isOpen, onClose, onSubmit, courseName, isLoading, certificateUrl, alreadyGenerated }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {alreadyGenerated ? t('Certificate Already Generated') : t('Request Certificate')}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {alreadyGenerated ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                  {t('Your certificate has already been generated for this course. You can download it from your user profile.')}
                </p>
                {certificateUrl ? (
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('Download Certificate')}
                  </a>
                ) : null}
              </div>
            </div>
            <Button
              onClick={handleClose}
              className="w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {t('Close')}
            </Button>
          </div>
        ) : certificateUrl ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 mb-3">
                  {t('Certificate generated successfully!')}
                </p>
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('Download Certificate')}
                </a>
              </div>
            </div>
            <Button
              onClick={handleClose}
              className="w-full"
            >
              {t('Close')}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('Course')}: <span className="font-medium">{courseName}</span>
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>{t('Important')}:</strong> {t('Please enter your name carefully in English. Certificates are issued only once and cannot be changed later.')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t('Your Name (in English)')}
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Enter your full name in English')}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 text-white ">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  disabled={isLoading || !name.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('Processing...')}
                    </div>
                  ) : (
                    t('Request Certificate')
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CertificateModal;
