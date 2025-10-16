import React from 'react';
import { Star } from 'lucide-react';

const PointsDisplay = ({ points }) => (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg">
        <Star size={18} className="mr-2" />
        <span className="font-bold">{points} XP</span>
      </div>
  );
  export default PointsDisplay;
  