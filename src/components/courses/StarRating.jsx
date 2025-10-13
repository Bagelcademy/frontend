import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${star <= rating
          ? 'fill-yellow-400 text-yellow-400'
          : 'fill-gray-300 text-gray-300'
          }`}
      />
    ))}
    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
      {rating.toFixed(1)}
    </span>
  </div>
);

export default StarRating;
