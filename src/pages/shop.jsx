import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubscriptionCard = ({ title, price, discountPrice, period, isHighlighted, isBestOffer, features, onSubscribe }) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className={`w-72 rounded-3xl overflow-hidden ${isHighlighted ? 'border-2 border-red-500' : ''} relative`}>
      {isBestOffer && (
        <div 
          className={`absolute top-10 ${i18n.language === 'fa' ? '-left-20' : 'right-0'} 
          bg-yellow-400 text-black font-bold py-1 px-10 rounded-bl-md transform 
          ${i18n.language === 'fa' ? '-rotate-45' : 'rotate-45'} translate-x-10 -translate-y-2`}
        >
          {t('Best Offer')}
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle>{t(title)}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {discountPrice ? (
          <>
            <span className="text-2xl font-bold line-through">{price} {t('Rial')}</span>
            <span className="text-3xl font-bold text-green-500 ml-2">{discountPrice} {t('Rial')}</span>
          </>
        ) : (
          <span className="text-3xl font-bold">{price} {t('Rial')}</span>
        )}
        <p className="text-sm text-gray-500">{t('per')} {t(period)}</p>
        <ul className="mt-4 text-left h-32">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>{t(feature)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="rounded-full text-white" onClick={onSubscribe}>{t('Subscribe Now')}</Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleSubscribe = async (amount) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch('https://bagelapi.artina.org/account/payment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      const data = await response.json();
      console.log('Subscription successful:', data);
      
      // Redirect to the payment URL in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No payment URL provided');
      }
    } catch (err) {
      setError(t('An error occurred during subscription. Please try again.'));
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBase p-4">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">{t('Choose Your Subscription')}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-wrap justify-center gap-6">
        <SubscriptionCard
          title="Monthly"
          price="129000"
          period="month"
          isHighlighted={true}
          features={[
            "Full access to all features",
            "24/7 customer support",
            "Cancel anytime"
          ]}
          onSubscribe={() => handleSubscribe(129000)}
        />
        <SubscriptionCard
          title="6 Months"
          price="729000"
          period="6 months"
          isBestOffer={true}
          features={[
            "All monthly features",
            "Priority support",
            "Exclusive content",
            "50% off first month"
          ]}
          onSubscribe={() => handleSubscribe(729000)}
        />
        <SubscriptionCard
          title="Yearly"
          price="1200000"
          period="year"
          features={[
            "All 6-month features",
            "2 months free",
            "Annual performance review",
            "Early access to new features"
          ]}
          onSubscribe={() => handleSubscribe(1200000)}
        />
      </div>
      {loading && <p className="mt-4">{t('Processing subscription...')}</p>}
    </div>
  );
};

export default SubscriptionCards;
