import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './DiscountBanner.css';

const DiscountBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 48); // 48 hours from now
    return targetDate;
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = timeLeft - now;

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return null; // Time's up
  };

  const [timer, setTimer] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = () =>
    timer
      ? `${String(timer.hours).padStart(2, '0')}:${String(timer.minutes).padStart(2, '0')}:${String(timer.seconds).padStart(2, '0')}`
      : t('Expired');

  const handleClick = () => {
    navigate('/shop');
  };

  return (
    <div className="discount-banner mt-24" onClick={handleClick}>
        
      <span className="banner-text">
        {t('Code:')} <span className="bagel">BAGEL</span> {t('for 30% off')}
      </span>
      <span className="timer">{formatTime()}</span>
    </div>
  );
};

export default DiscountBanner;
