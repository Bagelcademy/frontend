// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import CharacterIntroPage from './pages/characters';
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
import { GoftinoSnippet } from '@mohsen007/react-goftino/dist/index.js';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { i18n } = useTranslation();
  const GOFTINO_KEY = "cD7Gse";

  // Check login status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    setIsLoggedIn(!!(accessToken && refreshToken));
    console.log('isLoggedIn:', isLoggedIn);
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
            <Route path="/ask" element={<RequestPage />} />
            <Route path="/cha" element={<CharacterIntroPage />} />
            <Route path="/lo" element={<LoginPagee />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/course/:id" element={<CourseLandingPage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn}> <UserProfilePage /> </ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute isLoggedIn={isLoggedIn}> <MyCourses /> </ProtectedRoute>} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute isLoggedIn={isLoggedIn}> <LessonPage /> </ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
