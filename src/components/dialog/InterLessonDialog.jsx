import React from 'react';
import { X } from 'lucide-react';

const InterLessonDialog = ({ isOpen, onClose, message, svgUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Well done!</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <img src={svgUrl} alt="Character" className="w-full h-48 object-contain mb-4" />
          <p className="text-lg">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InterLessonDialog;