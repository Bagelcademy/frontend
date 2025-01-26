import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe2, Briefcase, Users, Star, Filter, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

// CourseCard Component
const CourseCard = ({ course }) => {
  const { t } = useTranslation();
  
  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102">
      <div className="relative">
        <img 
          src={course.image_url} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2">
          {course.title}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{t(`courseLevels.${course.level.toLowerCase()}`)}</span>
              </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{course.enroll_count || 0}</span>
            </div>
          </div>
          
                      <div className="space-y-4">
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            {/* <Briefcase className="w-4 h-4 mx-1" /> */}
                            <StarRating rating={4.5} />
                            </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Globe2 className="w-4 h-4 mr-2" />
                            <span>{course.language}</span>
                          </div>
                        </div>
                        </div>
          <Link 
            to={`/course/${course.id}`}
            className="block mt-4 text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
          >
            {t('Start Learning')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
