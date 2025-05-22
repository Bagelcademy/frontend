import React from 'react';
import { motion } from 'framer-motion';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className="h-2 rounded-full \${index < currentStep 
              ? 'bg-blue-500' 
              : index === currentStep 
                ? 'bg-blue-300' 
                : 'bg-white bg-opacity-20"
          initial={{ width: index === currentStep ? 12 : 20 }}
          animate={{ 
            width: index === currentStep ? 40 : 20,
            backgroundColor: index < currentStep 
              ? '#3b82f6' 
              : index === currentStep 
                ? '#93c5fd' 
                : 'rgba(255, 255, 255, 0.2)'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
