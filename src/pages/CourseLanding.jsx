import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, User, BookOpen, Users, Clock, ChevronRight, Trophy, Star, Lock, Check, ChevronLeft,
  Share2, ClipboardCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseLandingPage = () => {
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
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
  
        const [courseResponse, popularResponse] = await Promise.all([
          courseRequest,
          popularRequest
        ]);
  
        const [courseData, popularData] = await Promise.all([
          courseResponse.json(),
          popularResponse.json()
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
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
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