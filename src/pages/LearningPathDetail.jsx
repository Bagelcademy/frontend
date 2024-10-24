import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const LearningPathDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathData = async () => {
      if (!id) {
        setError('Invalid learning path ID');
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://bagelapi.artina.org/courses/learning-paths/${id}/`;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBackground dark:bg-darkBackground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBackground dark:bg-darkBackground">
        Error: {error}
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBackground dark:bg-darkBackground">
        No data available for this learning path.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-gray-100">
      <header className="bg-borderColor text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{pathData.title}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">{pathData.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Duration: {pathData.duration}
              </span>
              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Level: {pathData.level}
              </span>
              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Lessons: {pathData.lessons}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Progress: 0%</span>
              <span className="text-sm font-medium">{pathData.courses_count} courses</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-buttonColor rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Courses in this path:</h2>
        {pathData.courses && pathData.courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pathData.courses.map((course, index) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-buttonColor rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <Link
                    to={`/course/${course.id}`}
                    className="inline-block bg-buttonColor text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors duration-200"
                  >
                    Start Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses available for this learning path.</p>
        )}
      </main>
    </div>
  );
};

export default LearningPathDetail;