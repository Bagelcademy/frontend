// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CourseLandingPage from './pages/CourseLanding';
import LessonPage from './pages/Lesson';
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
import AISurvey from './pages/survey2';
import ContactPage from './pages/ContacUs';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(accessToken && refreshToken);
  });
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { i18n } = useTranslation();
  const GOFTINO_KEY = "cD7Gse";

  // const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    // checks axios access token validity
    if (accessToken && refreshToken) {
      fetch('https://bagelapi.bagelcademy.org/account/token/validate-token/', {
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
            // navigate('/login');
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
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  return (
    <Router>
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
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/shop" element={<SubscriptionCards />} />
            <Route path="/resetpass" element={<ResetPassword />} />
            <Route path="/learning-paths" element={<CareerPathsPage />} />
            <Route path="/learning-paths/:id" element={<LearningPathDetail />} />
            <Route path="/exam/:id" element={<ExamPage />} />
            <Route path="/payment_status" element={<PaymentStatusPage />} />
            <Route path="/quiz" element={<QuizComponent />} />
            <Route path="/game" element={<DonutCatcherGame />} />
            <Route path="/ask" element={<RequestPage />} />
            <Route path="/characters" element={<CharacterIntroPage />} />
            <Route path="/lo" element={<LoginPagee />} />
            <Route path="/survey" element={<Survey />} />
          
            <Route path="/course/:id" element={<CourseLandingPage />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/contact-us" element={<ContactPage />} />

            <Route path="/AIservey" element={<AISurvey />} />

            <Route path="/interview" element={<Interviewer />} />

            <Route path="/profile" element={<UserProfilePage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/my-courses" element={<MyCourses setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage setIsLoggedIn={setIsLoggedIn} />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
