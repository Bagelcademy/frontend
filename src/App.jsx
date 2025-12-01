// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CourseLandingPage from './pages/CourseLanding';
import LessonPage from './pages/LessonPage';
import UserProfilePage from './pages/UserProfile';
import QuizComponent from './pages/WhatToLearnQuiz';
import RequestPage from './pages/CourseRequest';
import Layout from './components/layout/Layout';
import Courses from './pages/Courses';
import CharacterIntroPage from './pages/cha';
import AboutUs from './pages/AboutUs';
import MyCourses from './pages/MyCourses';
import Survey from './pages/Survey';
import NotFoundPage from './pages/NotFoundPage';
import SubscriptionCards from './pages/shop';
import LearningPathDetail from './pages/LearningPathDetail';
import PaymentStatusPage from './pages/PaymentStatusPage';
import CareerPathsPage from './pages/LearningPath';
import ResetPassword from './pages/PasswordReset';
import LoginPagee from './pages/t';
import ExamPage from './pages/Exam';
import PrivacyPolicy from './pages/privacy';
import TermsOfService from './pages/terms';
import { GoftinoSnippet } from '@mohsen007/react-goftino';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DonutCatcherGame from './pages/game1';
import FAQ from './pages/FAQ';
import Interviewer from './pages/interviewer';
//import AISurvey from './pages/survey2';
import ContactPage from './pages/ContacUs';
import AINewsPage from './pages/blog';
import MetricsDashboard from './pages/chart';
import TeacherPanel from './pages/TeacherPanel';
import NoroozPage from './pages/Norooz';
import TeacherWaitlist from './pages/TeacherWait';
import RobotCharactersPage from './pages/cha';
import AIRobotsCharacters from './pages/cha';
import CVEnhancer from './pages/CVenhancer';
import PixelCityWorld from './pages/test';
import BlogDetailPage from './pages/BlogDetailPage';
import ChallengePage from './pages/challenger';
import IntroScreen from './components/layout/AppIntro';
import BackButtonHandler from './components/layout/BackButtonHandler';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(accessToken && refreshToken);
  });
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('isDarkTheme');
      if (stored !== null) return stored === 'true';
    } catch (e) {
      // ignore (e.g. SSR or blocked storage)
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const { i18n } = useTranslation();
  const GOFTINO_KEY = "cD7Gse";


  // Check login status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    // checks axios access token validity
    if (accessToken && refreshToken) {
      fetch('https://api.tadrisino.org/account/token/validate-token/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          }
          else {
            setIsLoggedIn(false);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.setItem('isLoggedIn', false);
          }
        })
        .catch((error) => {
          console.error('Failed to validate token:', error);
          setIsLoggedIn(false);
        });
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng); // ✅ persist it explicitly
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('isDarkTheme', String(next));
      } catch (e) {
        // ignore storage errors
      }
      return next;
    });
  };

  // Listen to system color-scheme changes if user hasn't set a preference
  useEffect(() => {
    let mq;
    try {
      const stored = localStorage.getItem('isDarkTheme');
      if (stored === null && typeof window !== 'undefined' && window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDarkTheme(e.matches);
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
        return () => {
          if (mq.removeEventListener) mq.removeEventListener('change', handler);
          else mq.removeListener(handler);
        };
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <BackButtonHandler />
      <GoftinoSnippet
        goftinoKey={GOFTINO_KEY}
        onReady={() => window.Goftino.close()}
      />
      <div dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
        <Layout
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          changeLanguage={changeLanguage}
          currentLanguage={i18n.language}
        >
          <Routes>
            {/* Intro Screen - shows first on site load */}
            <Route path="/intro" element={<IntroScreen/>}/>
            <Route path="/" element={<IntroScreen />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/resetpass" element={<ResetPassword />} />

            {/* User pages */}
            <Route path="/profile" element={<UserProfilePage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/my-courses" element={<MyCourses setIsLoggedIn={setIsLoggedIn} />} />

            {/* Public pages */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/ask" element={<RequestPage />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/characters" element={<AIRobotsCharacters />} />
            <Route path="/quiz" element={<QuizComponent />} />
            <Route path="/shop" element={<SubscriptionCards />} />
            <Route path="/payment_status" element={<PaymentStatusPage />} />

            {/* courses related pages */}
            <Route path="/course/:id" element={<CourseLandingPage />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/learning-paths" element={<CareerPathsPage />} />
            <Route path="/learning-paths/:id" element={<LearningPathDetail />} />
            <Route path="/exam/:id" element={<ExamPage />} />
            <Route 
                  path="/courses/:courseId/challenges/:challengeNumber" 
                  element={<ChallengePage setIsLoggedIn={setIsLoggedIn} />} 
                                                                            />
            {/* Special pages */}
            <Route path="/waitlist" element={<TeacherWaitlist />} />
            <Route path="/Norooz" element={<NoroozPage />} />

            {/* Policy pages */}
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* company related pages */}
            <Route path="/metric" element={<MetricsDashboard />} />
            <Route path="/Cve" element={<CVEnhancer />} />
            {/* <Route path="/pix" element={<PixelCityWorld />} /> */}

            {/* In progress pages */}
            <Route path="/blog" element={<AINewsPage/>} />
            <Route path="/blog/:id" element={<BlogDetailPage/>} />

            {/* <Route path="/game" element={<DonutCatcherGame />} /> */}
            <Route path="/teachpanel" element={<TeacherPanel />} />
            {/* <Route path="/interview" element={<Interviewer />} /> */}
            {/* <Route path="/AIservey" element={<AISurvey />} /> */}

            {/* Catch-all route - must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
