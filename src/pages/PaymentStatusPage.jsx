import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PaymentStatusPage = () => {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');
  const authority = searchParams.get('authority');

  const isSuccess = status === 'success';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {isSuccess ? (
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          ) : (
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          )}
          <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? t('Payment Successful') : t('Payment Failed')}
          </h1>
          <p className="text-gray-600 mb-4">
            {isSuccess
              ? (t('Thank you! Your payment has been processed successfully.'))
              : (t("We're sorry, but your payment could not be processed at this time.")) }
          </p>
          {!isSuccess && (
            <p className="text-gray-600 mb-4">
              {t('Please try again or contact our support team for assistance.')}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {t('Authority')} <span className="font-mono">{authority || t('Not provided')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;