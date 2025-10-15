import React from 'react';
import { Star } from 'lucide-react';

// star rating shown inside the image in cards
export const StarRating = ({ rating }) => (
  <div className="flex items-center justify-center w-24 h-7 px-1 py-1 rounded-lg bg-gray-200/40 backdrop-blur-sm dark:bg-gray-700/40">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ))}
    <span className="mx-1 text-xs text-gray-700 dark:text-gray-300">
      {rating.toFixed(1)}
    </span>
  </div>
);

export default StarRating;