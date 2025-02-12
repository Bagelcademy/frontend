import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useEffect } from 'react';

const SubscriptionCard = ({ title, price, discountPrice, period, isHighlighted, isBestOffer, features, onSubscribe, subDuration }) => {
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
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-bold line-through text-gray-400">{price} {t('Rial')}</span>
              <span className="text-3xl font-bold text-green-500 ml-2">{discountPrice} {t('Rial')}</span>
            </div>
          </>
        ) : (
          <span className="text-3xl font-bold">{price} {t('Rial')}</span>
        )}
        <p className="text-sm text-gray-500">{t('per')} {t(period)}</p>
        <ul className="mt-4 text-left h-32">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              {index === features.length - 1 ? (
                <Gift className="mx-1 h-4 w-4 text-red-500" />
              ) : (
                <Check className="mx-1 h-4 w-4 text-green-500" />
              )}
              <span>{t(feature)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="rounded-full text-white bg-gray-800 dark:bg-gray-800:" onClick={onSubscribe}>{t('Subscribe')} {subDuration} {subDuration > 1 ? t('months') : t('month')}</Button>
      </CardFooter>
    </Card>
  );
};


const AICreditsCard = ({ discountPercent, onBuyCredits }) => {
  const [credits, setCredits] = useState(1);
  const { t } = useTranslation();

  const basePrice = 29900;
  const totalPrice = basePrice * credits;
  const discountedPrice = discountPercent
    ? Math.round(totalPrice * (1 - discountPercent / 100))
    : totalPrice;

  const handleCreditsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setCredits(value);
    }
  };

  return (
    <Card className="w-72 rounded-3xl overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle>{t('AI Credits')}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center">
            {discountPercent > 0 ? (
              <>
                <span className="text-2xl font-bold line-through text-gray-400">
                  {totalPrice} {t('Rial')}
                </span>
                <span className="text-3xl font-bold text-green-500">
                  {discountedPrice} {t('Rial')}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                {totalPrice} {t('Rial')}
              </span>
            )}
            <p class="text-sm text-gray-500">{t("Number of")}</p>
          </div>

          <div className="mx-1 mt-5">
            <Input
              id="credits"
              type="number"
              min="1"
              max="10"
              value={credits}
              onChange={handleCreditsChange}
              className="text-center"
            />
          </div>
        </div>

        <ul className="mt-4 text-left h-32">
          <li className="flex items-center mb-2">
            <Check className="mx-1 h-4 w-4 text-green-500" />
            <span>{t('1 AI Credit = 1 Course')}</span>
          </li>
          <li className="flex items-center mb-2">
            <Check className="mx-1 h-4 w-4 text-green-500" />
            <span>{t('Max 10 Credits per Purchase')}</span>
          </li>
          <li className="flex items-center mb-2">
            <Check className="mx-1 h-4 w-4 text-green-500" />
            <span>{t('Credits Never Expire')}</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          className="rounded-full text-white bg-gray-800 dark:bg-gray-800"
          onClick={() => onBuyCredits(credits, discountedPrice)}
        >
          {t('Buy AI Credits')}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const applyDiscount = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Notify.failure(t('Please login first.'));
      navigate('/login');
      return; // Stop further execution
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://bagelapi.bagelcademy.org/account/discounts/verify-discount/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: discountCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid discount code');
      }

      const data = await response.json();
      setDiscountPercent(data.percent);
      console.log('Discount applied:', data);
    } catch (err) {
      setError(t('Invalid or expired discount code'));
      setDiscountPercent(0);
      console.error('Discount error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (amount, planCode) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Notify.failure(t('Please login first.'));
      navigate('/login');
      return; // Stop further execution
    }

    setLoading(true);
    setError(null);

    try {
      const bodyData = {
        amount: amount,
        plan_code: planCode,
      };

      // Add discount_code only if it exists
      if (discountCode) {
        bodyData.discount_code = discountCode;
      }

      const response = await fetch('https://bagelapi.bagelcademy.org/account/payment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      const data = await response.json();
      console.log('Subscription successful:', data);

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

  const calculateDiscountedPrice = (originalPrice) => {
    return discountPercent
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : null;
  };

  const handleBuyCredits = async (credits, amount) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Notify.failure(t('Please login first.'));
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bodyData = {
        credits: credits,
        amount: amount,
      };

      // Add discount_code only if it exists
      if (discountCode) {
        bodyData.discount_code = discountCode;
      }

      const response = await fetch('https://bagelapi.bagelcademy.org/account/BuyCredit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error('Credit purchase failed');
      }

      const data = await response.json();
      console.log('Credit purchase successful:', data);

      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No payment URL provided');
      }
    } catch (err) {
      setError(t('An error occurred during credit purchase. Please try again.'));
      console.error('Credit purchase error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBase p-4">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">{t('Choose Your Subscription')}</h1>

      <div className="mb-4 flex items-center">
        <Input
          placeholder={t('Enter discount code')}
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="mx-2 w-48"
        />
        <Button onClick={applyDiscount} disabled={loading}>
          {t('Apply Discount')}
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {discountPercent > 0 && (
        <p className="text-green-600 mb-4">
          {t('Discount applied')}: {discountPercent}% {t('off')}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        <SubscriptionCard
          title="Monthly"
          price="198000"
          discountPrice={calculateDiscountedPrice(129000)}
          period="month"
          // isHighlighted={true}
          features={[
            "Full access to all features",
            "24/7 customer support",
            "1 Bonus AI Credits"
          ]}
          onSubscribe={() => handleSubscribe(129000, '1M')}
          subDuration={1}
        />
        <SubscriptionCard
          title="6 Months"
          price="1089000"
          discountPrice={calculateDiscountedPrice(729000)}
          period="6 months"
          isBestOffer={true}
          isHighlighted={true}
          features={[
            "All monthly features",
            "Priority support",
            "50% off first month",
            "6 Bonus AI Credits"
          ]}
          onSubscribe={() => handleSubscribe(729000, '6M')}
          subDuration={6}
        />
        <SubscriptionCard
          title="Yearly"
          price="2178000"
          discountPrice={calculateDiscountedPrice(1200000)}
          period="year"
          features={[
            "All 6-month features",
            "1 months free",
            "Early access to new features",
            "12 Bonus AI Credits"
          ]}
          onSubscribe={() => handleSubscribe(1200000, '12M')}
          subDuration={12}
        />
        <AICreditsCard
          discountPercent={discountPercent}
          onBuyCredits={handleBuyCredits}
        />
      </div>
      {loading && <p className="mt-4">{t('Processing...')}</p>}
    </div>
  );
};

export default SubscriptionCards;
