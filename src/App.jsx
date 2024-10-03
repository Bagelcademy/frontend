import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import FuturisticFamilyPage from './pages/characters1';
import AboutUs from './pages/AboutUs';
import MyCourses from './pages/MyCourses';
import Survey from './pages/Survey';
import NotFoundPage from './pages/NotFoundPage';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Layout
        isLoggedIn={isLoggedIn}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:id" element={<CourseLandingPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/quiz" element={<QuizComponent/>} />
          <Route path="/ask" element={<RequestPage/>} />
          <Route path="/cha" element={<CharacterIntroPage/>} />
          <Route path="/cha1" element={<FuturisticFamilyPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/survey" element={<Survey />} />


        </Routes>
      </Layout>
    </Router>
  );
};

export default App;














