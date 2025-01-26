import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Snowflake, GraduationCap, TicketPercent, NotebookPen, LibraryBig } from 'lucide-react';

const DiscountBanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 48); // 48 hours from now
    return targetDate;
  });

  const [icons, setIcons] = useState([]); // State to manage icon properties

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

  // Function to generate random icons
  const generateRandomIcons = () => {
    const newIcons = Array.from({ length: 10 }, () => { // Increased the number of icons to 10
      const randomIcon = [Snowflake, GraduationCap, TicketPercent, NotebookPen, LibraryBig][Math.floor(Math.random() * 5)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        Icon: randomIcon,
        top: `${Math.random() * 80}%`, // Random top position
        left: `${Math.random() * 90}%`, // Random left position
        size: Math.random() * 30 + 10, // Random size between 20px and 50px
        opacity: 0, // Start hidden
        targetOpacity: Math.random() * 0.4 + 0.3, // Random opacity between 0.3 and 0.7
      };
    });
    setIcons(newIcons);

    // Gradually fade icons in and out
    newIcons.forEach((icon, index) => {
      setTimeout(() => {
        setIcons((prevIcons) =>
          prevIcons.map((i) =>
            i.id === icon.id ? { ...i, opacity: icon.targetOpacity } : i
          )
        );
      }, index * 300); // Stagger fade-in timing (shortened for quicker animations)

      setTimeout(() => {
        setIcons((prevIcons) =>
          prevIcons.map((i) =>
            i.id === icon.id ? { ...i, opacity: 0 } : i
          )
        );
      }, index * 300 + 2000); // Fade out after 2 seconds
    });
  };

  // Generate new icons every 2-3 seconds
  useEffect(() => {
    generateRandomIcons();
    const interval = setInterval(() => {
      generateRandomIcons();
    }, Math.random() * 1000 + 5000); // Random interval between 2 and 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="mt-24 relative flex items-center justify-center gap-4 bg-blue-700 bg-opacity-80 text-white py-4 px-6 cursor-pointer shadow-md hover:bg-opacity-100 transition-all duration-300 overflow-hidden"
      onClick={handleClick}
    >
      {/* Background Icons */}
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

      {/* Banner Content */}
      <div className="flex text-lg font-semibold text-shadow-sm gap-1">
        {t('Code')}
        <div className="font-bold text-shadow-md bg-orange-700 px-2 rounded-lg">
          BAGEL
        </div>
        <div className="flex">{t('for')}</div>
        <div className="font-b5 text-shadow-md px-2 rounded-lg underline underline-offset-8">
          {t('30% off')}
        </div>
      </div>
      <div className="text-xl font-b5 text-shadow-sm">{formatTime()}</div>
    </div>
  );
};

export default DiscountBanner;
