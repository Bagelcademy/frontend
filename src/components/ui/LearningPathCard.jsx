import React from 'react';
import { Clock, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StarRating from '../ui/StarRatingImage';

const LearningPathCard = ({ path }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card
      className="group h-full overflow-hidden border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
      onClick={() => navigate(`/learning-path/${path.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={path.image}
          alt={path.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <StarRating rating={parseFloat(path.rating)} />
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <h3
            className="text-lg font-semibold mb-2 line-clamp-2 h-[52px] group-hover:text-blue-600 dark:group-hover:text-blue-400"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {path.title}
          </h3>

          <p
            className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-[42px]"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {path.description}
          </p>

          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mx-1" />
                <span>{path.duration} {t('months')}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 mx-2" />
                <span>{path.lessons}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mx-2 text-blue-500" />
                <span>{path.enrolledCount.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to={`/learning-paths/${path.id}`}
              className="block mt-4 text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
            >
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300">
                <span className="mx-2">{t('Start Learning')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathCard;
