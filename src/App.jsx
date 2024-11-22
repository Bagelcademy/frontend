// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Make sure to import this
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
// import LearningPathDetail from './pages/LearningPathDetail';
import LearningPathDetail from './pages/l';
import PaymentStatusPage from './pages/PaymentStatusPage';
import CareerPathsPage from './pages/LearningPath';
import ResetPassword from './pages/PasswordReset';
import LoginPagee from './pages/t';
import ExamPage from './pages/Exam';
import { GoftinoSnippet }from '@mohsen007/react-goftino/dist/index.js';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { i18n } = useTranslation();
  const GOFTINO_KEY = "cD7Gse";


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Ensure i18n is initialized
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <GoftinoSnippet
        goftinoKey={GOFTINO_KEY}
        onReady={() => {
          window.Goftino.close();
        }}
      />
      <div dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
        <Layout
          isLoggedIn={isLoggedIn}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          changeLanguage={changeLanguage} // Pass it here
          currentLanguage={i18n.language} // 
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/course/:id" element={<CourseLandingPage />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/learning-paths" element={<CareerPathsPage />} />
            <Route path="/learning-paths/:id" element={<LearningPathDetail />} />  
            <Route path="/payment_status" element={<PaymentStatusPage />} />          
            <Route path="/quiz" element={<QuizComponent />} />
            <Route path="/shop" element={<SubscriptionCards />} />
            <Route path="/ask" element={<RequestPage />} />
            <Route path="/cha" element={<CharacterIntroPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/resetpass" element={<ResetPassword />} />
            <Route path="/lo" element={<LoginPagee />} />
            <Route path="/exam" element={<ExamPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
