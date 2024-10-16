import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import heroImage from '../assets/3.png';
import quizGif from '../assets/2.gif';
import signupGif from '../assets/3.gif';
import aiGif from '../assets/ai_section.gif';
import CounterSection from '../components/ui/CounterSection';
import { useTranslation } from 'react-i18next';

// Import Bagel family images
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
import i18n from '../i18n';

const HomePage = ({ isDarkTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://bagelapi.artina.org/courses/course-generation/popular_courses/');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const bagelFamily = [
    { id: 1, nameKey: "mama_bagel", image: img4 },
    { id: 2, nameKey: "papa_bagel", image: img5 },
    { id: 3, nameKey: "emily_bagel", image: img6 },
    { id: 4, nameKey: "jackie_bagel", image: img7 },
  ];

  // Check if the language is Persian
  const isRTL = i18n.language === 'fa';

  return (
    <main>
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-6xl font-b5 md:text-6xl font-bold text-white mb-4 animate-fade-in-down">{t('Welcome')}</h2>
            <Link to="./courses">
              <Button size="lg" className="animate-bounce bg-buttonColor text-white hover:bg-opacity-80 mt-8">
                {t('Explore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-lightBackground dark:bg-darkBackground">
        <h2 className="text-4xl font-b6 mb-6 text-center text-gray-900 dark:text-white">{t('PopularCourses')}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="w-64 transition-transform hover:scale-105 border border-borderColor">
              <img src={course.image_url} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <CounterSection />
      
      <section className={`flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-white dark:bg-gray-800 text-black dark:text-white`}>
        <div className={`md:w-1/2 mt-6 md:mt-0 text-left ml-[10%] ${isRTL ? 'mr-[10%] text-right' : ''}`}>
          <h2 className="text-4xl font-b6 mb-4">{t('Ready to design your own course?')}</h2>
          <p className="mb-6">{t('Design a course based on any subject or any languages you want!')}</p>
          <Link to="/ask">
            <Button variant="secondary" size="lg" className="bg-buttonColor text-white hover:bg-gray-800">
              {t('go to AI')}
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 md:pl-20 md:pr-8 flex justify-center">
          <img src={aiGif} alt="Sign Up" className="w-64 md:w-96" />
        </div>
      </section>

      <section className={`flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-lightBackground dark:bg-black`}>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img src={quizGif} alt="Quiz" className="w-64 md:w-96" />
        </div>
        <div className={`md:w-1/2 md:pl-8 md:pr-8 text-left ${isRTL ? 'ml-16 text-right' : ''}`}>
          <h2 className="text-4xl font-b6 mb-4 text-gray-900 dark:text-white">{t('Not sure what to learn?')}</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{t('Take our quiz to find the perfect course for you!')}</p>
          <Link to="/quiz">
            <Button size="lg" className="animate-pulse bg-buttonColor text-white hover:bg-opacity-80">
              {t('Take Quiz')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Bagel Family Section */}
      <section className="py-16 px-4 bg-gradient-to-br bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-b6 text-black dark:text-white text-center mb-8">{t('Meet the Bagel Family')}</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {bagelFamily.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer w-48"
            >
              <img src={character.image} alt={t(character.nameKey)} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-center">{t(character.nameKey)}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/cha">
            <Button size="lg" className="bg-buttonColor text-white hover:bg-gray-800">
              {t('meet our characters')}
            </Button>
          </Link>
        </div>
      </section>

      <section className={`flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-lightBackground dark:bg-black text-black dark:text-white`}>
        <div className={`md:w-1/2 ml-[10%] mt-6 md:mt-0 text-left ${isRTL ? 'mr-[10%] text-right' : ''}`}>
          <h2 className="text-4xl font-b6 mb-4">{t('Ready to start learning?')}</h2>
          <p className="mb-6">{t('Sign up now and get access to all our courses!')}</p>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="bg-buttonColor text-white hover:bg-gray-800">
              {t('Sign Up')}
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 md:pl-20 md:pr-8 flex justify-center">
          <img src={signupGif} alt="Sign Up" className="w-64 md:w-96" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
