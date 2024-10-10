import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook

const CounterSection = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const { t } = useTranslation(); // Call the useTranslation hook

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await fetch('https://bagelapi.artina.org/courses/Statistics/counters/');
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
    let current = 1034;
    const interval = setInterval(() => {
      current += 1;
      setter(current);
      if (current >= target) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <section className="py-12 px-4 bg-lightBackground dark:bg-darkBackground text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('Our Growing Community')}</h2>
      <div className="flex justify-center space-x-12">
        <div>
          <p className="text-4xl font-bold text-buttonColor">{courseCount}</p>
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('Courses')}</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-buttonColor">{userCount}</p>
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('Users')}</p>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
