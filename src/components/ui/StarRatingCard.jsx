import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
        }`}
      />
    ))}
    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
      {rating.toFixed(1)}
    </span>
  </div>
);

export default StarRating;