import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-16 h-16">
        {/* Outer circle */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-red-200 rounded-full animate-spin-slow"></div>
        {/* Inner circle */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;