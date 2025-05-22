import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const Listbox = ({ value, onChange, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full py-3 bg-white bg-opacity-20 rounded-lg text-white font-semibold flex items-center justify-between px-4 hover:bg-opacity-30 transition-all"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2 text-blue-300">{icon}</span>}
          {value.label}
        </div>
        <ChevronDown className="w-5 h-5 text-blue-300 transition-transform \${isOpen ? 'rotate-180' : ''}" />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bg-gray-800 bg-opacity-95 backdrop-blur-lg rounded-lg mt-2 z-10 w-full max-h-48 overflow-y-auto border border-blue-500 border-opacity-30"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="block w-full py-2 px-4 hover:bg-blue-500 hover:bg-opacity-30 transition-colors text-left flex items-center justify-between"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.value === value.value && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Listbox;
