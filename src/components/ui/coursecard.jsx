import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseCard = ({ course }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full justify-between border border-borderColor dark:border-gray-700 bg-white dark:bg-gray-800 shadow rounded-md overflow-hidden transition-transform transform hover:scale-105">
      {/* Card Header */}
      <div className="border-b border-borderColor dark:border-gray-700 p-4">
        <img src={course.image_url} alt={course.title} className="w-full h-32 object-cover rounded-t-md" />
        <h2 className="text-lg my-1 min-h-24 ">{course.title}</h2>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center mt-2">
          <BookOpen className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {course.lessonCount} {t('lessons')}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-borderColor dark:border-gray-700 p-4 flex justify-center">
        <Link to={`/course/${course.id}`}>
          <button className="bg-buttonColor text-white py-2 px-4 rounded">
            {t('Start Learning')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
