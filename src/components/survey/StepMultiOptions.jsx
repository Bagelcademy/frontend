import React from "react";
import { Sparkles } from "lucide-react";
import Check from "./Check";




const StepMultiOptions = ({
  options,
  selectedOptions,onSelectMulti,
  maxSelectionsReached,
  t,
  currentStepData ,
   answers,
  canProceed,
  
  onNext,
  categoryIconMap,
  loadingCategories,
}) => {
    if (loadingCategories) {
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("Loading categories...")}
            </p>
          </div>
        );
      }

      return (
        <div className="w-full">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Selected")}: {selectedOptions.length}/3
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentStepData.options.map((option) => {
              const isSelected = selectedOptions.find(
                (item) => item.id === option.id
              );
              const Icon = categoryIconMap[option.name] || Sparkles;

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    onSelectMulti(option)
                  }
                  disabled={!isSelected && maxSelectionsReached}
                  className={`p-4 rounded-lg shadow-md transition-all duration-300 relative
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 hover:shadow-lg"
                    }
                    ${
                      !isSelected && maxSelectionsReached
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-white/20"
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <p className="text-sm font-medium">{t(option.name)}</p>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check size={16} className="text-blue-500" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={onNext}
            disabled={!canProceed()}
            className={`mt-8 w-full p-3 rounded-lg font-medium transition-all
              ${
                canProceed()
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
          >
            {t("Complete Survey")}
          </button>
        </div>
      );
};

export default StepMultiOptions;
