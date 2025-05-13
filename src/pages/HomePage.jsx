import React, { useState, useEffect ,useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import i18n from '../i18n';
import {
  BookOpen, Award, Check, Search, Users,
  Clock, Star, Filter, Rocket, BrainCircuit,
  Brain, Target, Gift, Globe2, GraduationCap, UserCheck,Route} from 'lucide-react';
import heroImage from '../assets/137.png';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';


const CourseCard = ({ course }) => {
  const { t } = useTranslation();

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
          {/* Updated Title Section */}
          <h3
            className="text-lg font-semibold mb-3 line-clamp-2 h-[48px]"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {course.title}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 mx-1" />
                <span>{t(`courseLevels.${course.level.toLowerCase()}`)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe2 className="w-4 h-4 mx-1" />
                <span>{t(course.language) || t('English')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
        >
          <span className="mr-2">{t("Start Learning")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};


const DiagonalDivider = ({ className }) => (
  <div className={`relative h-24 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polygon points="0,0 100,0 100,20 0,100" className="fill-current" />
    </svg>
  </div>
);

const CircuitPattern = ({ className }) => (

  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 10 0 L 10 10 M 0 10 L 20 10"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-current opacity-10"
        />
      </pattern>
      <rect x="0" y="0" width="100" height="100" fill="url(#circuit)" />
    </svg>
  </div>
);

const FeatureSection = ({ icon: Icon, title, description, gradient, buttonText, linkTo, reversed, imageUrl, features }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative py-24 ${reversed ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} overflow-hidden`}
    >
      <CircuitPattern className="opacity-5" />
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
          <div className="flex-1 z-10">
            <motion.div
              initial={{ x: reversed ? 50 : -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className={`p-4 rounded-xl inline-block ${gradient} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className="w-12 h-12 text-white dark:text-blue-400" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ x: reversed ? 50 : -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ x: reversed ? 50 : -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl mb-8 text-gray-600 dark:text-gray-300 text-justify"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ x: reversed ? 50 : -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                onClick={() => navigate(linkTo)}
                className={`${gradient} text-white hover:opacity-90 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {buttonText}
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ x: reversed ? -50 : 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 z-10"
          >
            <div className="relative group">
              <div className={`absolute inset-0 ${gradient} opacity-20 dark:opacity-40 blur-xl rounded-2xl transform group-hover:scale-105 transition-transform duration-500`}></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transform group-hover:scale-102 transition-all duration-500">
                <img
                  src={imageUrl || "/api/placeholder/600/400"}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 dark:opacity-40 blur-2xl"></div>
                <div className="relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg -mt-16 mx-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('Key Features')}
                  </h4>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                        <Check className="w-4 h-4 mr-2 text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


const CounterCard = ({ icon: Icon, value, label, bgImage, gradient }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [value]);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className={`absolute inset-0 ${gradient || 'bg-gradient-to-r from-blue-500/90 to-purple-600/90'} 
        transition-opacity duration-300 group-hover:opacity-95`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-8 backdrop-blur-sm">
        <div className="mb-4 p-4 rounded-full bg-white/20 backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">
          {count.toLocaleString()}+
        </h3>
        
        <p className="text-white/90 text-lg font-medium">
          {label}
        </p>

        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      </div>
    </motion.div>
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
        const response = await fetch('https://api.tadrisino.org/courses/courses/popular_courses/');
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
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Learn, Grow, Succeed | Tadrisino')}</title>
        <meta name="description" content="Discover personalized learning paths, interactive courses, and a supportive community at Tadrisino. Start your learning journey today!" />
        <meta name="keywords" content="online learning, courses, education, career paths, personalized learning" />
        <meta property="og:title" content="Learn, Grow, Succeed | Tadrisino" />
        <meta property="og:description" content="Transform your future with Tadrisino's innovative learning platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Learn, Grow, Succeed | Tadrisino" />
        <meta name="twitter:description" content="Transform your future with Tadrisino's innovative learning platform." />
        <link rel="canonical" href="https://tadrisino.org" />
      </Helmet>

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
          <div className="text-lg sm:text-4xl dark:text-zinc-300 text-gray-700 ">
            {t('LearnWithAI')}
          </div>

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
      <div className=" mx-auto px-4 p-16 mt-2 mb-8">
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

      {/* Counter Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CounterCard
              icon={BookOpen}
              value={100}
              label={t('Active Courses')}
              bgImage="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Faf240937-9a88-47d2-9a12-66b5abb6e206.png"
              gradient="bg-gradient-to-r from-blue-600/90 to-blue-800/90"
            />
            <CounterCard
              icon={UserCheck}
              value={400}
              label={t('Active Users')}
              bgImage="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Faf240937-9a88-47d2-9a12-66b5abb6e206.png"
              gradient="bg-gradient-to-r from-purple-600/90 to-purple-800/90"
            />
          </div>
        </div>
      </div>


      {/* Feature Sections */}
      <div className="relative">
        <FeatureSection
          icon={BrainCircuit}
          title={t('Design Courses with AI')}
          description={t('Unleash your creativity and expertise by designing custom courses. Our intuitive course builder empowers you to create engaging content in any subject or language.')}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          buttonText={t('Start Creating')}
          linkTo="/ask"
          imageUrl="https://test1-emgndhaqd0c9h2db.a01.azurefd.net/images/5556f361-914c-42fb-9e5c-0577013af010.png"
          // imageUrl="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F9253aec3-5d18-4927-8906-9137951601e6.png"
          features={[t('Create engaging courses'), t('Multi-language support'), t('Interactive course builder')]}
        />

        <FeatureSection
          icon={Brain}
          title={t('Discover Your Perfect Path')}
          description={t('Not sure where to start? Take our interactive learning assessment to find courses that align perfectly with your interests, goals, and learning style.')}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          buttonText={t('Take Assessment')}
          linkTo="/quiz"
          reversed={true}
          imageUrl="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F77a28a1d-6c43-4d0b-b164-6a078ba478a8.png"
          features={[t('Personalized recommendations'), t('Expert guidance'), t('Adaptive learning paths')]}
        />

        <FeatureSection
          icon={Route}
          title={t('Chart Your Career Journey')}
          description={t('Explore structured learning paths designed to take you from beginner to professional. Each path is carefully crafted to build your skills progressively.')}
          gradient="bg-gradient-to-r from-blue-600 to-purple-600"
          buttonText={t('Explore Paths')}
          linkTo="/learning-paths"
          imageUrl="https://test1-emgndhaqd0c9h2db.a01.azurefd.net/images/29e89c2b-5405-4519-9467-f15a0e07d3c4.png"
          features={[t('Structured learning paths'), t('Industry-relevant curriculum'), t('Certification & career support')]}
        />

        <FeatureSection
          icon={Gift}
          title={t('Join the Bagel Family')}
          description={t('Become part of our thriving learning community. Meet our friendly character guides who will support and inspire you throughout your educational journey.')}
          gradient="bg-gradient-to-r from-purple-600 to-blue-600"
          buttonText={t('Meet the Family')}
          linkTo="/characters"
          reversed={true}
          imageUrl="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F20402def-7f74-4e80-add6-048298adbb54.png"
          features={[t('Community-driven learning'), t('Interactive support system'), t('Live Q&A and discussion groups')]}
        />
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
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;