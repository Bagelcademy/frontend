import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, BookOpen } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next'; // Importing the translation hook

const CourseLandingPage = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://bagelapi.artina.org//courses/courses/${id}/with_lessons/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourse(data);
        setLoading(false);

        const enrollmentResponse = await fetch(`https://bagelapi.artina.org//courses/enroll/${id}/enroll/`, {
          method: 'GET',
          credentials: 'include'
        });

        if (enrollmentResponse.ok) {
          const enrollmentData = await enrollmentResponse.json();
          if (enrollmentData.status === 'enrolled') {
            setIsEnrolled(true);
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleLessonClick = (lessonId) => {
    navigate(`/courses/${id}/lessons/${lessonId}`);
  };

  const handleEnrollClick = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`https://bagelapi.artina.org//courses/enroll/${id}/enroll/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsEnrolled(true);
      } else {
        const data = await response.json();
        console.error("Error enrolling in course:", data);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const comments = [
    { name: 'John Doe', comment: t('This course completely changed my perspective on the topic. Highly recommend!') },
    { name: 'Jane Smith', comment: t('Amazing content and great instructor. Learned a lot!') },
    { name: 'Samuel Johnson', comment: t('The course was very engaging and informative. Worth every minute.') },
    { name: 'Emily Davis', comment: t('Great course, very well structured and easy to follow.') },
    { name: 'Michael Brown', comment: t('Loved the practical examples and exercises. It really helped me understand the concepts.') }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (loading) return <div className="text-center p-4">{t('Loading...')}</div>; // Use translation
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!course) return <div className="text-center p-4">{t('No course found')}</div>; // Use translation

  return (
    <div className="bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <section className="relative h-[60vh] overflow-hidden">
        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center px-4 md:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-fade-in-down">{course.title}</h1>
            <div className="bg-black bg-opacity-60 text-white rounded-lg p-4 md:p-6 animate-fade-in-up mt-8">
              <p className="text-lg md:text-xl">{course.description}</p>
            </div>
          </div>
        </div>
      </section>


      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{course.teacher}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(course.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('Course Content')}</h2> {/* Use translation */}
          <ul className="space-y-4">
            {course.lessons?.map((lesson, index) => (

             
             <li key={index} className="flex items-start bg-lightBackground dark:bg-gray-700 rounded-lg p-4 transition-transform transform hover:scale-105">
              <button
                            onClick={() => handleLessonClick(lesson.id)}
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 rounded hover:bg-gradient-to-l from-blue-500 to-green-400 transition duration-300 mr-3"
                          > 
                  {t('Go')} {/* Use translation */}
                <BookOpen className="w-5 h-5 mr-3 mt-1" />
                </button>

                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
                </div>
              </li>

            ))}
          </ul>
        </div>

        {/* Enroll Button */}
        <button
          onClick={handleEnrollClick}
          disabled={isEnrolled}
          className={`py-2 px-4 rounded ${isEnrolled ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-buttonColor to-red-500 text-white hover:scale-105 transition-transform'}`}
        >
          {isEnrolled ? t('You have enrolled already') : t('Enroll in Course')} {/* Use translation */}
        </button>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">{t('What Students Are Saying')}</h2> {/* Use translation */}
          <Slider {...sliderSettings}>
            {comments.map((comment, index) => (
              <Comment key={index} name={comment.name} text={comment.comment} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ name, text }) => (
  <div className="p-4 rounded-lg mx-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 transition-transform transform hover:scale-105">
    <p className="text-lg font-semibold">{name}</p>
    <p className="text-gray-700 dark:text-gray-300">{text}</p>
  </div>
);

export default CourseLandingPage;
