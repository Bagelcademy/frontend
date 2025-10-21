import React from 'react';

const LoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-16 w-16',
    large: 'h-24 w-24'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className={`animate-spin rounded-full border-t-4 border-b-4 border-blue-500 ${sizeClasses[size]}`} />
    </div>
  );
};

export default LoadingSpinner;