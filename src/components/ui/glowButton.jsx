import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';

const GlowingButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 
    before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-red-500
    before:animate-pulse before:blur-md hover:bg-red-700"
  >
    <span className="flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      Ask AI
    </span>
  </button>
);

const Modal = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-2xl h-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
        >
          ×
        </button>
        <div className="p-4 h-full">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export { GlowingButton, Modal };