import React from 'react';

const ProgressBar = ({ progress ,t}) => (
    <div className="w-full max-w-2xl mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{t("Start")}</span>
          <span>{t("Complete Profile")}</span>
        </div>
      </div>
)
 export default ProgressBar;
  