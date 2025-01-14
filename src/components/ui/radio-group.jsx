import React from 'react';
import clsx from 'clsx';

// Base RadioGroup Component
export const RadioGroup = ({ className, children, name, onChange, value }) => {
  return (
    <div role="radiogroup" className={clsx('radio-group', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name, // Pass the name prop to all children
            onChange, // Pass the onChange callback
            checked: child.props.value === value, // Determine if the child is the selected value
          });
        }
        return child;
      })}
    </div>
  );
};

// RadioGroupItem Component
export const RadioGroupItem = ({ className, value, name, onChange, checked, children }) => {
  return (
    <label className={clsx('radio-group-item', className)}>
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange} // Trigger the parent's onChange callback when selected
        checked={checked} // Ensure the input reflects the selected state
        className="radio-group-input"
      />
      <span className="radio-group-label">{children}</span>
    </label>
  );
};


// // Example CSS Classes for Styling (Optional)
// .radio-group { display: flex; flex-direction: column; gap: 8px; }
// .radio-group-item { display: flex; align-items: center; }
// .radio-group-input { margin-right: 8px; }
// .radio-group-label { cursor: pointer; }

export default { RadioGroup, RadioGroupItem };

