import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Book, Award, ChevronDown, ChevronUp, Play } from 'lucide-react';
import cimage from "../assets/12.png"
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix';


const LearningPathDetail = () => {
  const { id } = useParams();
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPathData = async () => {
      if (!id) {
        setError('Invalid learning path ID');
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://bagelapi.bagelcademy.org/courses/learning-paths/${id}/`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPathData(data);
      } catch (error) {
        console.error('Error fetching learning path data:', error);
        setError(`Failed to load learning path data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathData();
  }, [id]);

  const toggleCourse = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  const takeExamHandler = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = fetch('https://bagelapi.bagelcademy.org/courses/paths/1/generate_exam/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        Notify.failure('"You have not completed all courses in the learning path."');
      } else {
        navigate('/exam/1');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBackground dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buttonColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBackground dark:bg-darkBackground">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-lightBackground dark:bg-darkBackground">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-borderColor">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{pathData.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{pathData.description}</p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>{pathData.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Book className="w-5 h-5" />
                  <span>{pathData.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Award className="w-5 h-5" />
                  <span>{pathData.level}</span>
                </div>
              </div>
              <button className="bg-buttonColor text-white px-8 py-3 rounded-md font-medium hover:opacity-90 transition-colors">
                Start Career Path
              </button>
            </div>
            {/* Right Column */}
            <div className="w-full md:w-80">
              <div className="bg-lightBackground dark:bg-darkBackground p-6 rounded-lg border border-borderColor">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">What you'll learn:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-buttonColor flex-shrink-0 mt-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">Professional skills in {pathData.title}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-buttonColor flex-shrink-0 mt-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">{pathData.courses_count} comprehensive courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-buttonColor flex-shrink-0 mt-1"></div>
                    <span className="text-gray-600 dark:text-gray-300">{pathData.lessons} hands-on lessons</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Course Curriculum</h2>
        <div className="space-y-4">
          {pathData.courses.map((course, index) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg border border-borderColor">
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-lightBackground dark:hover:bg-darkBackground"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-buttonColor bg-opacity-10 dark:bg-opacity-20 text-buttonColor rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.lessons_count || 0} lessons
                    </p>
                  </div>
                </div>
                {expandedCourse === course.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {expandedCourse === course.id && (
                <div className="px-6 pb-4 border-t border-borderColor">
                  <div className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                    <Link
                      to={`/course/${course.id}`}
                      className="inline-flex items-center gap-2 text-buttonColor hover:opacity-90"
                    >
                      <Play className="w-4 h-4" />
                      Start Course
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-borderColor">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Earn a Career Certificate</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                After completing all courses in this Career Path, you'll receive a verified
                certificate of completion to share with your network.
              </p>
              <button
                className="bg-buttonColor text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition-colors"
                onClick={takeExamHandler}
              >
                {t('Take The Exam')}
              </button>
            </div>
            <div className="w-full md:w-80">
              <div className="bg-lightBackground dark:bg-darkBackground p-6 rounded-lg border border-borderColor">
                <img
                  src={cimage}
                  alt="Certificate Preview"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetail;