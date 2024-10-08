import React from 'react';

export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 bg-buttonColor text-white rounded-md hover:bg-opacity-90 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor ${className}`}
    ref={ref}
    {...props}
  />
));

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor ${className}`}
    ref={ref}
    {...props}
  />
));

export const Progress = ({ value, max = 100, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-buttonColor h-2.5 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);