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
          dir="auto"
          style={{ unicodeBidi: 'plaintext' }}
          className={`w-full p-3 box-border rounded-md focus:outline-none overflow-auto focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 dark:bg-slate-700/70'
          } ${className}`}
          {...props}
        />
      );
    }
  );
  