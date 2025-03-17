import React from 'react';

/**
 * A custom checkbox component that can be used as a replacement for UI library components
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the checkbox
 * @param {string} props.label - Label text to display next to checkbox
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Function to call when checkbox state changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered checkbox component
 */
const Checkbox = ({ 
  id, 
  label, 
  checked = false, 
  onChange, 
  className = "",
  required = false,
  disabled = false
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label 
        htmlFor={id} 
        className={`ml-2 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export {Checkbox};