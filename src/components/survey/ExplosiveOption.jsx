import React from 'react';
import { Coffee } from 'lucide-react';


const ExplosiveOption = ({ option, onSelect, isExploding, iconMap }) => {
    const Icon = iconMap[option] || Coffee;
  
    return (
      <button
        onClick={onSelect}
        className={`p-4 rounded-lg shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transform hover:scale-105
          ${isExploding ? "animate-[explosion_0.5s_ease-out]" : ""}`}
      >
        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Icon size={32} className="text-white" />
        </div>
        <p className="text-sm font-medium">{option}</p>
      </button>
    );
  };
  export default ExplosiveOption;