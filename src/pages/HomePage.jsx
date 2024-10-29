import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import heroImage from '../assets/137.png';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import CourseCard from '../components/ui/coursecard';

const HomePage = ({ isDarkTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18n.language === 'fa';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://bagelapi.artina.org/courses/course-generation/popular_courses/');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const gradientOverlay = "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent";

  return (
    <main className={`min-h-screen dark:bg-zinc-900 bg-white`}>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className={`absolute inset-0 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-zinc-900/90 bg-gradient-to-b from-blue-500/10 to-white/90`} />
          <div className={`absolute inset-0 dark:bg-[#00ff9d]/5 bg-[#00ff9d]/10`} />
          <div className={`absolute inset-0 dark:bg-gradient-to-t dark:from-zinc-900 dark:via-transparent dark:to-transparent bg-gradient-to-t from-gray-100 via-transparent to-transparent`} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-4 sm:space-y-8 w-full max-w-4xl mx-auto mt-16 sm:mt-20"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold dark:text-white text-black">
            <span className="bg-clip-text text-white drop-shadow-2xl">
              {t('Welcome')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl dark:text-zinc-300 text-gray-700 max-w-2xl mx-auto px-4">
            {/* {t('Ready to start learning?')} */}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" 
                className="bg-[#082f49] hover:opacity-90 dark:text-white dark:bg-gray-600 text-white font-bold px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
              >
                {t('Explore')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Popular Courses */}
      <section className={`py-12 sm:py-20 px-4 sm:px-8 dark:bg-zinc-900 bg-gray-100`}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center dark:text-white text-black">
          {t('PopularCourses')}
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <Card className="border-cyan-500 dark:bg-zinc-800/50 dark:text-white bg-gray-100 text-black shadow-lg overflow-hidden">
                <div className="relative aspect-video">
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={gradientOverlay} />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-base sm:text-lg dark:text-white text-black mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">{t('Learn More')}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-12 sm:py-20 px-4 sm:px-8 dark:bg-zinc-800 bg-white`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: t('Ready to design your own course?'),
              description: t('Design a course based on any subject or any languages you want!'),
              gradient: 'from-blue-500 to-cyan-500',
              link: '/ask',
              buttonText: t('go to AI')
            },
            {
              title: t('Not sure what to learn?'),
              description: t('Take our quiz to find the perfect course for you!'),
              gradient: 'from-cyan-500 to-blue-500',
              link: '/quiz',
              buttonText: t('Take Quiz')
            },
            {
              title: t('Meet the Bagel Family'),
              description: t('Learn with our friendly characters!'),
              gradient: 'from-blue-400 to-cyan-500',
              link: '/cha',
              buttonText: t('meet our characters')
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex flex-col justify-between dark:bg-zinc-800 dark:text-white bg-white text-black"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
              <div className={gradientOverlay} />
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="mb-4 sm:mb-6 dark:text-zinc-300 text-gray-700">{feature.description}</p>
                <Link to={feature.link}>
                  <Button 
                    className="dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
                  >
                    {feature.buttonText}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className={`absolute inset-0 dark:bg-gradient-to-r dark:from-zinc-700 dark:to-zinc-800 bg-gradient-to-r from-blue-500/10 to-gray-100`} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 dark:text-white text-black">
            {t('Ready to start learning?')}
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 dark:text-zinc-300 text-gray-700">
            {t('Sign up now and get access to all our courses!')}
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className={`bg-gradient-to-r from-blue-400 to-cyan-400 hover:opacity-90 font-bold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg ${isDarkTheme ? 'text-black' : 'text-white'}`}
            >
              {t('Sign Up')}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;