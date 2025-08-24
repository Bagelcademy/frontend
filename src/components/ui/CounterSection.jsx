import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook

const CounterSection = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const { t } = useTranslation(); // Call the useTranslation hook

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await fetch('http://localhost:8000/courses/Statistics/counters/');
        if (!response.ok) {
          throw new Error('Failed to fetch counters');
        }
        const data = await response.json();
        animateCounter(setCourseCount, data.course_count);
        animateCounter(setUserCount, data.user_count);
      } catch (error) {
        console.error('Error fetching counters:', error);
      }
    };

    fetchCounters();
  }, []);

  const animateCounter = (setter, target) => {
    let current = 34;
    const interval = setInterval(() => {
      current += 1;
      setter(current);
      if (current >= target) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <section className="py-8 px-4 bg-lightBackground dark:bg-darkBackground text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('Our Growing Community')}</h2>
      <div className="flex justify-center gap-8">
        <div className="w-40">
          <p className="text-4xl font-bold text-buttonColor">{courseCount}</p>
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('Course')}</p>
        </div>
        <div className="w-40">
          <p className="text-4xl font-bold text-buttonColor">{userCount + 32}</p>
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('User')}</p>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
