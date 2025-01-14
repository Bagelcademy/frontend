import React from 'react';
import PropTypes from 'prop-types';

export const Textarea = React.forwardRef(
    ({ value, onChange, placeholder, disabled, className, ...props }, ref) => {
      return (
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${className}`}
          {...props}
        />
      );
    }
  );
  