/*


import React from "react";
import ExplosiveOption from "./ExplosiveOption"; // فرض بر اینه که ExplosiveOption جداست

const StepOptions = ({ options, onSelect, explodingOption, iconMap , currentStepData ,handleSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentStepData.options.map((option) => (
            <ExplosiveOption
              key={option}
              option={option}
              onSelect={() => handleSelect(currentStepData.field, option)}
              isExploding={explodingOption === option}
              iconMap={iconMap}
            />
          ))}
        </div>
  );
};

export default StepOptions;*/
import React from "react";
import ExplosiveOption from "./ExplosiveOption";

const StepOptions = ({ currentStepData, explodingOption, iconMap, handleSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {currentStepData.options.map((option) => (
        <ExplosiveOption
          key={option}
          option={option}
          onSelect={() => handleSelect(currentStepData.field, option)}
          isExploding={explodingOption === option}
          iconMap={iconMap}
        />
      ))}
    </div>
  );
};

export default StepOptions;
