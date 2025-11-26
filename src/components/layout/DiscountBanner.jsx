import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Snowflake, GraduationCap, TicketPercent, NotebookPen, LibraryBig } from 'lucide-react'; // Import X icon

const DiscountBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const STORAGE_KEY = 'discount_banner_closed';

  const [isVisible, setIsVisible] = useState(true); // Keep track of visibility
  const [targetDate, setTargetDate] = useState(null);
  const [timer, setTimer] = useState(null);
  const [icons, setIcons] = useState([]);

  // Fetch the target date from API
  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const response = await fetch('https://api.tadrisino.org/shop/Countdown/get-remaining-time/');
        const data = await response.json();
        
        // Parse the target date from API response
        const parsedDate = new Date(data.target_date);
        setTargetDate(parsedDate);
      } catch (error) {
        console.error('Error fetching countdown:', error);
      }
    };

    fetchCountdown();
  }, []);
  
  useEffect(() => {
    try {
      const closed = localStorage.getItem(STORAGE_KEY);
      if (closed === 'true') {
        setIsVisible(false);
      }
    } catch (e) {
      // ignore localStorage errors (e.g., SSR or privacy settings)
      // keep banner visible by default
    }
  }, []);

  // Function to calculate remaining time
  const calculateTimeLeft = () => {
    if (!targetDate) return null;

    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      };
    }

    return null;
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = () =>
    timer
      ? `${timer.days} ${t('days')} ${String(timer.hours).padStart(2, '0')}:${String(timer.minutes).padStart(2, '0')}:${String(timer.seconds).padStart(2, '0')}`
      : t('Expired');

  const handleClick = () => {
    navigate('/shop');
  };

  // Close button function
  const handleClose = (event) => {
    event.stopPropagation(); // Prevent navigation on close
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // ignore
    }
    setIsVisible(false);
  };

  // Function to generate random icons
  const generateRandomIcons = () => {
    const newIcons = Array.from({ length: 10 }, () => {
      const randomIcon = [Snowflake, GraduationCap, TicketPercent, NotebookPen, LibraryBig][Math.floor(Math.random() * 5)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        Icon: randomIcon,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 90}%`,
        size: Math.random() * 30 + 10,
        opacity: 0,
        targetOpacity: Math.random() * 0.4 + 0.3,
      };
    });
    setIcons(newIcons);

    newIcons.forEach((icon, index) => {
      setTimeout(() => {
        setIcons((prevIcons) =>
          prevIcons.map((i) =>
            i.id === icon.id ? { ...i, opacity: icon.targetOpacity } : i
          )
        );
      }, index * 300);

      setTimeout(() => {
        setIcons((prevIcons) =>
          prevIcons.map((i) =>
            i.id === icon.id ? { ...i, opacity: 0 } : i
          )
        );
      }, index * 300 + 2000);
    });
  };

  useEffect(() => {
    generateRandomIcons();
    const interval = setInterval(() => {
      generateRandomIcons();
    }, Math.random() * 1000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-24"> {/* This div keeps the space even when banner is hidden */}
      {isVisible && (
        <div
          className="relative flex items-center justify-center gap-4 bg-blue-700 bg-opacity-80 text-white py-4 px-2 cursor-pointer shadow-md hover:bg-opacity-100 transition-all duration-300 overflow-hidden"
          onClick={handleClick}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 bg-white bg-opacity-30 hover:bg-opacity-50 text-black rounded-full p-1"
          >
            <X size={18} />
          </button>

          {/* Animated Icons */}
          {icons.map(({ id, Icon, top, left, size, opacity }) => (
            <Icon
              key={id}
              className="absolute transition-opacity duration-1000 ease-in-out"
              style={{
                top,
                left,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
              }}
            />
          ))}

          {/* Discount text */}
          <div className="flex text-lg font-semibold text-shadow-sm gap-1">
            {t('Code')}
            <div className="font-bold text-shadow-md bg-orange-700 px-2 rounded-lg">
              TADRIS
            </div>
            <div className="flex">{t('for')}</div>
            <div className="font-b5 text-shadow-md px-2 rounded-lg underline underline-offset-8">
              {t('30% off')}
            </div>
          </div>
          <div className="text-lg font-b5 text-shadow-sm">{formatTime()}</div>
        </div>
      )}
    </div>
  );
};

export default DiscountBanner;
