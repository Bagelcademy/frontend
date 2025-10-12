import React, { useState, useEffect ,useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import {
  BookOpen, Award, Check, Search, Users,
  Clock, Star, Filter, Rocket, BrainCircuit,
  Brain, Target, Gift, Globe2, GraduationCap, UserCheck,Route} from 'lucide-react';
import heroImage from '../assets/5.png';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';

import DiagonalDivider from '../components/home/DiagonalDivider';



import i18n from '../i18n';

import HeroSection from '../components/home/HeroSection';
import PopularCourses from '../components/home/PopularCourses';
import CounterSection from '../components/home/CounterSection';
import FeatureSection from '../components/home/FeatureSection';
import CTASection from '../components/home/CTASection';

import Image1 from '../assets/1.png';
import Image2 from '../assets/7.png';
import Image3 from '../assets/10.png';
import Image4 from '../assets/9.png';


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

      

      <HeroSection/>
      <PopularCourses  courses={courses}/>


      <CounterSection/>
      


      {/* Feature Sections */}
      <div className="relative">
        <FeatureSection
          icon={BrainCircuit}
          title={t('Design Courses with AI')}
          description={t('Unleash your creativity and expertise by designing custom courses. Our intuitive course builder empowers you to create engaging content in any subject or language.')}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          buttonText={t('Start Creating')}
          linkTo="/ask"
          imageUrl= {Image1}
          // imageUrl="https://test1-emgndhaqd0c9h2db.a01.azurefd.net/images/5556f361-914c-42fb-9e5c-0577013af010.png"
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
          imageUrl= {Image2}
          // imageUrl="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F77a28a1d-6c43-4d0b-b164-6a078ba478a8.png"
          features={[t('Personalized recommendations'), t('Expert guidance'), t('Adaptive learning paths')]}
        />

        <FeatureSection
          icon={Route}
          title={t('Chart Your Career Journey')}
          description={t('Explore structured learning paths designed to take you from beginner to professional. Each path is carefully crafted to build your skills progressively.')}
          gradient="bg-gradient-to-r from-blue-600 to-purple-600"
          buttonText={t('Explore Paths')}
          linkTo="/learning-paths"
          imageUrl= {Image3}
          // imageUrl="https://test1-emgndhaqd0c9h2db.a01.azurefd.net/images/29e89c2b-5405-4519-9467-f15a0e07d3c4.png"
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
          imageUrl= {Image4}
          // imageUrl="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F20402def-7f74-4e80-add6-048298adbb54.png"
          features={[t('Community-driven learning'), t('Interactive support system'), t('Live Q&A and discussion groups')]}
        />
      </div>
        <CTASection/>
      </div>
    
  );
};

export default HomePage;