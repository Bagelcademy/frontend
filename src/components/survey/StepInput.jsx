/*import React from 'react';
import { User } from 'lucide-react';

import React from "react";

const StepInput = ({ title, icon: Icon, value, placeholder, onChange, canProceed, onNext}) => {
  return (
    <div className="mb-6 w-full max-w-md mx-auto">
          <div className="flex items-center mb-4">
            {React.createElement(currentStepData.icon, {
              size: 24,
              className: "text-blue-500 mr-2",
            })}
            <label className="text-lg font-medium">
              {currentStepData.title}
            </label>
          </div>
          <input
            type="text"
            value={answers[currentStepData.field] || ""}
            onChange={(e) =>
              handleTextInput(currentStepData.field, e.target.value)
            }
            placeholder={currentStepData.placeholder}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={moveToNextStep}
            disabled={!canProceed()}
            className={`mt-4 w-full p-3 rounded-lg font-medium transition-all
              ${
                canProceed()
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
          >
            {t("Continue")}
          </button>
        </div>
  );
};

export default StepInput;*/

import React from "react";

const StepInput = ({
  title,
  icon: Icon,
  value,
  placeholder,
  onChange,
  canProceed,
  
  onNext,
  t,
}) => {
  return (
    <div className="mb-6 w-full max-w-md mx-auto">
      <div className="flex items-center mb-4">
        {Icon && <Icon size={24} className="text-blue-500 mr-2" />}
        <label className="text-lg font-medium">{title}</label>
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`mt-4 w-full p-3 rounded-lg font-medium transition-all
          ${
            canProceed
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
      >
        {t ? t("Continue") : "Continue"}
      </button>
    </div>
  );
};

export default StepInput;





