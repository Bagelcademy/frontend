import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Star, BookOpen, Award, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import StarRating from './StarRating';

const RecommendedCourseCard = ({ course }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'fa';

    return (
      <Card className="group h-full overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {t('Recommended')}
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.enroll_count || 0} {t('Enrolled')}</span>
              </div>
              <StarRating rating={4.5} />
            </div>
          </div>
        </div>

        <CardContent className="relative p-6 flex flex-col justify-between">
          <div className="flex flex-col h-full">
            <h3
              className="text-lg font-semibold mb-3 line-clamp-2 h-[52px]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {course.title}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-4 h-4 mx-1" />
                  <span>{t(`courseLevels.${course.level.toLowerCase()}`)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Globe2 className="w-4 h-4 mx-1" />
                  <span>{t(course.language)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mx-1" />
                  <span>{course.lesson_count} {t("lessons")}</span>
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Award className="w-4 h-4 mx-1" />
                  <span>{t('Certificate')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => navigate(`/course/${course.id}`)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white group-hover:scale-105 transition-all duration-300"
          >
            <span className="mx-2">{t('Start Learning')}</span>
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

export default RecommendedCourseCard;
