import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import heroImage from '../assets/1201.png';
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
        const response = await fetch('https://bagelapi.bagelcademy.org/courses/course-generation/popular_courses/');
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
    <main className={`min-h-screen ${isDarkTheme ? 'bg-zinc-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-b from-blue-500/10 to-zinc-900/90' : 'bg-gradient-to-b from-blue-500/10 to-white/90'}`} />
          <div className="absolute inset-0 bg-[#00ff9d]/5" />
          <div className={`absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-t from-zinc-900' : 'bg-gradient-to-t from-gray-50'} via-transparent to-transparent`} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-8 px-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              {t('Welcome')}
            </span>
          </h1>
          <div className="flex gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-6 text-lg"
              >
                {t('Explore')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-4 md:px-8">
        <h2 className={`text-4xl font-bold mb-12 text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          {t('PopularCourses')}
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <Card className={`border-none ${isDarkTheme ? 'bg-zinc-800/50' : 'bg-white'} shadow-lg overflow-hidden`}>
                <div className="relative aspect-video">
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={gradientOverlay} />
                </div>
                <div className="p-6">
                  <h3 className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{t('Learn More')}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 px-4 md:px-8 ${isDarkTheme ? 'bg-zinc-800/50' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: t('Design your own course'),
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
              className="relative overflow-hidden rounded-2xl p-8 min-h-[300px] flex flex-col justify-between"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
              <div className={gradientOverlay} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-200 mb-6">{feature.description}</p>
                <Link to={feature.link}>
                  <Button 
                    className="bg-gray-700 hover:bg-gray-600 text-white"
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
      <section className="relative py-32 px-4">
        <div className={`absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' : 'bg-gradient-to-r from-blue-100 to-cyan-100'}`} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-8`}>
            {t('Ready to start learning?')}
          </h2>
          <p className={`text-xl ${isDarkTheme ? 'text-zinc-300' : 'text-gray-600'} mb-8`}>
            {t('Sign up now and get access to all our courses!')}
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-6 text-lg"
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