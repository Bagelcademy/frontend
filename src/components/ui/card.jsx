import React from 'react';

export const Card = ({ className, children }) => (
  <div className={`dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 text-gray-900 dark:text-white shadow rounded-md overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b border-borderColor dark:border-gray-700 p-4">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h2 
    className="text-xl font-semibold my-1 line-clamp-2 h-[56px]"
    style={{
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {children}
  </h2>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
    {children}
  </p>
);

export const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

export const CardFooter = ({ children }) => (
  <div className="border-t border-borderColor dark:border-gray-700 p-4">
    {children}
  </div>
);
