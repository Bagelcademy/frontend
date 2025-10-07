import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, User, BookOpen, Users, Clock, ChevronRight, Trophy, Star, Lock, Check, ChevronLeft,
  Share2, ClipboardCheck, Target, Zap, Brain
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseLandingPage = () => {
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastCompletedLessonId, setLastCompletedLessonId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'fa';
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Check if user is logged in by checking if access token exists
        const accessToken = localStorage.getItem('accessToken');
        setIsLoggedIn(!!accessToken);
  
        // Set up fetch requests with appropriate headers
        const courseRequest = fetch(`https://api.tadrisino.org/courses/courses/${id}/with_lessons/`);
        
        // Fetch popular courses based on authentication status
        const popularRequest = accessToken ? 
          fetch('https://api.tadrisino.org/courses/Recommendation/recommend-courses/', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }) : 
          fetch('https://api.tadrisino.org/courses/courses/popular_courses/'); // Fetch popular courses if not logged in

        // Fetch challenges for this course
        const challengesRequest = fetch('https://api.tadrisino.org/challenge/challenges/list/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
          },
          body: JSON.stringify({
            course_id: id
          })
        });
  
        const [courseResponse, popularResponse, challengesResponse] = await Promise.all([
          courseRequest,
          popularRequest,
          challengesRequest
        ]);
  
        const [courseData, popularData, challengesData] = await Promise.all([
          courseResponse.json(),
          popularResponse.json(),
          challengesResponse.json()
        ]);
  
        if (accessToken) {
          // Only fetch enrollment and completion status if user is logged in
          const [enrollmentResponse, completionResponse] = await Promise.all([
            fetch(`https://api.tadrisino.org/courses/enroll/${id}/check_enroll/`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch(`https://api.tadrisino.org/courses/student-progress/last-completed-lesson/`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                course_id: id
              })
            })
          ]);
  
          const [enrollmentData, completionData] = await Promise.all([
            enrollmentResponse.json(),
            completionResponse.json()
          ]);
  
          setIsEnrolled(enrollmentResponse.ok && enrollmentData.is_enrolled);
          setLastCompletedLessonId(completionData.lesson_id);
        }
  
        setCourse(courseData);
        setPopularCourses(popularData);
        setChallenges(challengesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [id, isEnrolled]);

  const handleLessonClick = (lessonId, index) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    if (!isEnrolled && index > 0) {
      // Only allow first lesson if not enrolled
      return;
    }

    // Find the index of the last completed lesson
    const lastCompletedIndex = course.lessons.findIndex(lesson => lesson.id === lastCompletedLessonId);

    // Allow access to completed lessons and the next unopened lesson
    if (isEnrolled && (index <= lastCompletedIndex + 1)) {
      navigate(`/courses/${id}/lessons/${lessonId}`);
    }
  };

const handleChallengeClick = (challenge) => {
  if (!isLoggedIn) {
    navigate('/login');
    return;
  }
  navigate(`/courses/${id}/challenges/${challenge.challenge_number}`);
};

  const handleShare = () => {
    const currentURL = window.location.href; // Get the current page URL
    navigator.clipboard.writeText(currentURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset message after 2 sec
    });
  };

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://api.tadrisino.org/courses/enroll/${id}/enroll/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'medium':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'hard':
        return <Brain className="w-5 h-5 text-blue-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
              }`}
          />
        ))}
        <span className="mx-2 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!course) return <div className="text-center p-4">{t('No course found')}</div>;

  return (
    <div className=" bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white min-h-screen">
  {/* Hero Section */}
  <section className="relative h-[70vh] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 dark:from-blue-600/80 dark:to-purple-600/80"></div>
    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover mix-blend-overlay" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fade-in-down">
          {course.title}
        </h1>
        <div className="flex items-center justify-center space-x-8 mb-8 text-white">
          <div className="flex items-center">
            <Clock className="w-6 h-6 mx-2" />
            <span>{course.lessons?.length || 0} {t('lessons')}</span>
          </div>
        </div>
        <button
          onClick={handleEnrollClick}
          disabled={isEnrolled}
          className={`
            px-8 py-4 rounded-lg text-lg font-semibold text-white
            ${isEnrolled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isEnrolled ? t('Enrolled') : t('Enroll Now')}
        </button>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={handleShare}
            className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-5 h-5 mx-2" />
                {t('Copied!')}
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mx-2" />
                {t('Share')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* Course Description Section */}
  <section className="max-w-6xl mx-auto px-4 py-12 text-justify">
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <BookOpen className="w-6 h-6 mx-2 text-blue-400" />
        {t('Course Description')}
      </h2>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-gray-700 dark:text-gray-300">
          {course.description}
        </p>
      </div>
    </div>
  </section>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Lessons */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mx-2 text-blue-400" />
                {t('Course Content')}
              </h2>
              <div className="space-y-4">
                {course.lessons?.map((lesson, index) => {
                  const lastCompletedIndex = course.lessons.findIndex(l => l.id === lastCompletedLessonId);
                  const isCompleted = lastCompletedIndex >= 0 && index <= lastCompletedIndex;
                  const isLocked = !isLoggedIn || (!isEnrolled && index > 0) || (isEnrolled && index > lastCompletedIndex + 1);

                  return (
                    <div
                      key={index}
                      onClick={() => handleLessonClick(lesson.id, index)}
                      className={`group bg-white dark:bg-gray-700 rounded-lg p-4 ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                        } transform hover:scale-102 transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                            } text-white`}>
                            {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                          </span>
                          <h3 className="font-medium">{lesson.title}</h3>
                        </div>
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          isRtl ? (
                            <ChevronLeft className="w-5 h-5 text-blue-400 group-hover:-translate-x-2 transition-transform" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-2 transition-transform" />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Challenges */}
            
{challenges.length > 0 && (
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-700">
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <Trophy className="w-6 h-6 mx-2 text-blue-500" />
      {t('Course Challenges')}
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      {t('Test your knowledge with these practice challenges designed for this course.')}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          onClick={() => handleChallengeClick(challenge)}
          className="group bg-white dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-600 transform hover:scale-102 transition-all duration-300 border border-purple-200 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getDifficultyIcon(challenge.difficulty)}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                #{challenge.challenge_number}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {t(`difficulty_${challenge.difficulty.toLowerCase()}`)}
            </span>
          </div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
            {challenge.topic}
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('Challenge')} {challenge.challenge_number}
            </div>
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 text-purple-500 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Trophy className="w-6 h-6 mx-2 text-yellow-400" />
                {t('RecommendedCourses')}
              </h2>
              <div className="space-y-4">
                {popularCourses.slice(0, 3).map((popularCourse, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/course/${popularCourse.id}`)}
                    className="group bg-white dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 relative"
                  >
                    <div className="relative h-32">
                      <img
                        src={popularCourse.image_url}
                        alt={popularCourse.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {!isLoggedIn && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{popularCourse.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mx-1" />
                          <span>{popularCourse.enroll_count || 0}</span>
                        </div>
                        <StarRating rating={4.2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;