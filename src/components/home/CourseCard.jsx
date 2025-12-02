import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Globe2, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

const CourseCard = ({ course }) => {
    const { t } = useTranslation();
  
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
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm">4.5</span>
              </div>
            </div>
          </div>
        </div>
  
        <CardContent className="relative p-6">
          <div className="flex flex-col h-full">
            {/* Updated Title Section */}
            <h3 className="text-lg font-semibold mb-3 line-clamp-2 min-h-[48px] break-words">
              {course.title}
            </h3>
  
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mx-1" />
                  <span>{t(`courseLevels.${course.level.toLowerCase()}`)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Globe2 className="w-4 h-4 mx-1" />
                  <span>{t(course.language) || t('English')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 hover:from-blue-600  hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">{t("Start Learning")}</span>
          </Button>
        </CardFooter>
      </Card>
    );
  };
  export default CourseCard;
