import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import {
  BookOpen, Award, Zap, Search, Users,
  Clock, ChevronRight, Star, Filter, Rocket,
  Brain, Target, Gift, Globe2
} from 'lucide-react';
import heroImage from '../assets/137.png';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';
const CourseCard = ({ course }) => {
  return (
    <Card className="group h-full overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex items-center space-x-2 text-white mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm">4.5</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="relative p-6">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-3 line-clamp-2">
            {course.title}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 mx-1" />
                <span>{course.level || 'Beginner'}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe2 className="w-4 h-4 mx-1 " />
                <span>{course.language || 'English'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
        >
          <span className="mr-2">Start Learning</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient, buttonText, linkTo }) => {
  const navigate = useNavigate();

  return (
    <Card className="group h-full overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full">
        <div className={`p-3 rounded-lg ${gradient} mb-4 w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{description}</p>
        <Button
          onClick={() => navigate(linkTo)}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
        >
          {buttonText}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

const HomePage = ({ isDarkTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18n.language === 'fa';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://bagelapi.bagelcademy.org/courses/courses/popular_courses/');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen mt-24 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-zinc-900/90 bg-gradient-to-b from-blue-500/10 to-purple-800" />
          <div className="absolute inset-0 dark:bg-[#00ff9d]/5 bg-[#00ff9d]/10" />
          <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-zinc-900 dark:via-transparent dark:to-transparent bg-gradient-to-t from-gray-100 via-transparent to-transparent}\" />
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
            {t('Ready to start learning?')}
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
      <div className=" mx-auto px-4 p-16 mt-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-b5 text-gray-900 dark:text-white my-8 text-center">
            {t('PopularCourses')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className=" mx-auto px-4 py-16 bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-b5 text-gray-900 dark:text-white mb-8 text-center">
            {t('Why Choose Us')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Rocket}
              title={t('Design Your Course')}
              description={t('Design a course based on any subject or any languages you want! Our intuitive course builder makes it easy to create engaging content.')}
              gradient="bg-gradient-to-r from-blue-500 to-blue-600"
              buttonText={t('Create Course')}
              linkTo="/ask"
            />
            <FeatureCard
              icon={Brain}
              title={t('Not sure what to learn?')}
              description={t('Take our personalized learning quiz to discover courses that match your interests, goals, and learning style.')}
              gradient="bg-gradient-to-r from-purple-500 to-purple-600"
              buttonText={t('Take Quiz')}
              linkTo="/quiz"
            />
            <FeatureCard
              icon={Gift}
              title={t('Meet the Bagel Family')}
              description={t('Join our vibrant community of learners and meet our friendly character guides who will support you throughout your learning journey.')}
              gradient="bg-gradient-to-r from-blue-500 to-purple-600"
              buttonText={t('Meet Characters')}
              linkTo="/cha"
            />
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('Ready to start learning?')}
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            {t('Sign up now and get access to all our courses!')}
          </p>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-4"
          >
            {t('Sign Up Now')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>

  );
};

export default HomePage;