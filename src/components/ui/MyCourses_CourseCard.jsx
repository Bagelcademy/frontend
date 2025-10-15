import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Zap, Globe2, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import StarRating from './StarRatingImage';

const CourseCard = ({ item }) => {
    const { t, i18n } = useTranslation();
    const { course, progress } = item;
    const isRtl = i18n.language === 'fa';
    const completedLessons = progress.completed_lessons.length;
    const TOTAL_LESSONS = course.lesson_count
    const progressPercentage = (completedLessons / TOTAL_LESSONS) * 100;
    const isCompleted = completedLessons === TOTAL_LESSONS && TOTAL_LESSONS > 0;

    return (
      <Card className="group h-full overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center space-x-2 text-white mb-2">
              <StarRating rating={4.5} />
            </div>
          </div>
          {isCompleted && (
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {t('Completed')}
              </div>
            </div>
          )}
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
                <div className="flex items-center">
                  <Award className="w-4 h-4 mx-1 text-purple-500" />
                  <span>{progress.points_earned} {t('Points')}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mx-1 text-yellow-500" />
                  <span>{progress.streak} {t("Streak")}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t("Progress")}</span>
                  <span className="font-medium">{completedLessons}/{TOTAL_LESSONS} {t("lessons")}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-2">
            <Button
              onClick={() => navigate(`/course/${course.id}`)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
            >
              <span className="mx-2">
                {progress.course_completed ? t('Review Course') : t('Continue Learning')}
              </span>
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
            
            {isCompleted && (
              <Button
                onClick={() => handleCertificateRequest(course.id, course.title)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group-hover:scale-105 transition-all duration-300"
              >
                <Award className="w-4 h-4 mx-1" />
                <span className="mx-2">{t('Request Certificate')}</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

export default CourseCard;
