import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Book, Award, ChevronDown, ChevronUp, Play, Loader2, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Notify } from 'notiflix';
import i18n from '../i18n';
import cimage from "../assets/12.png";


const LearningPathDetail = () => {
  const { id } = useParams();
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  // Character pop-up state
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [popupCharacter, setPopupCharacter] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPathData = async () => {
      if (!id) {
        setError(t('Invalid learning path ID'));
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is logged in by checking if access token exists
        const accessToken = localStorage.getItem("accessToken");
        setIsLoggedIn(!!accessToken);
        
        const url = `https://api.tadrisino.org/courses/learning-paths/${id}/`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPathData(data);

        // Fetch user progress if logged in
        if (accessToken) {
          const progressUrl = `https://api.tadrisino.org/courses/paths/${id}/user_progress/`;
          const progressResponse = await fetch(progressUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setUserProgress(progressData);
            setIsEnrolled(progressData.enrollment_status === "Enrolled");
          }
        }
      } catch (error) {
        console.error('Error fetching learning path data:', error);
        setError(t('Failed to load learning path data') + `: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathData();
  }, [id, t]);

  const enrollInPath = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://api.tadrisino.org/courses/learning-paths/${id}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const data = await response.json();
        setIsEnrolled(true);
        // Show success message
        Notify.success(t('Enrolled successfully'));
        // If there's a character in the response, show it in popup
        if (data.character) {
          setPopupCharacter(data.character);
          setShowCharacterPopup(true);
        }
        // Refresh user progress
        const progressUrl = `https://api.tadrisino.org/courses/paths/${id}/user_progress/`;
        const progressResponse = await fetch(progressUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserProgress(progressData);
        }
      } else {
        throw new Error('Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling in path:', error);
      Notify.failure(t('Failed to enroll in the career path'));
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const takeExamHandler = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/courses/paths/1/generate_exam/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        Notify.failure(t('You have not completed all courses in the learning path.'));
      } else {
        navigate('/exam/1');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{pathData.title}</h1>
          <p className="text-lg text-white/90">{pathData.description}</p>
        </div>
      </div> */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <img
          src={pathData.image}
          alt={pathData.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
          <div className="max-w-4xl">
            <h1 className="text-7xl font-b5 mb-4">{pathData.title}</h1>
            <p className="text-lg">{pathData.description}</p>
          </div>
        </div>
      </div>

      {/* Learning Path Info */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-6 mb-8 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{pathData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <span>{t('lessons')}: {pathData.lessons}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{t(pathData.level)}</span>
              </div>
              {userProgress && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{t('Progress')}: {Math.floor(userProgress.user_progress)}%</span>
                </div>
              )}
            </div>

            <button 
              onClick={!isEnrolled ? enrollInPath : undefined}
              disabled={isEnrolled}
              className={`
            px-8 py-4 rounded-lg text-lg font-semibold text-white
            ${
              isEnrolled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            }
          `}
            >
              {isEnrolled ? t('Already Enrolled') : t('Start Career Path')}
            </button>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img src={cimage} alt="Learning Path" className="rounded-lg shadow-lg w-full md:w-80" />
          </div>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">{t('Course Curriculum')}</h2>
        <div className="space-y-4">
          {pathData.courses.map((course, index) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-lg font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all rounded-t-lg"
              >
                <span>{index + 1}. {course.title}</span>
                {expandedCourse === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {expandedCourse === course.id && (
                <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                  <Link
                    to={`/course/${course.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Play className="w-4 h-4" />
                    {t('Start Course')}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('Earn a Career Certificate')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('certificateDescription')}</p>
          <button
            className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all"
            onClick={takeExamHandler}
          >
            {t('Take The Exam')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetail;
