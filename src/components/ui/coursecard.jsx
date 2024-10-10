import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const CourseCard = ({ course }) => {
  const { t } = useTranslation();
  return (
    <Card className="w-full border border-borderColor dark:border-gray-700 bg-lightBackground dark:bg-gray-800 transition-transform transform hover:scale-105">
      <CardHeader>
        <img src={course.image_url} alt={course.title} className="w-full h-32 object-cover rounded-t-md" />
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mt-2">
          <BookOpen className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{course.lessonCount} {t('lessons')}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/course/${course.id}`}>
          <Button className="bg-buttonColor  text-white py-2 px-4 rounded">
            {t('Start Learning')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
