import React from 'react';
import { useSelectContext } from './select';

const SelectValue = ({ placeholder }) => {
  const { value } = useSelectContext();

  return (
    <span className="block truncate">
      {value || placeholder}
    </span>
  );
};

export default SelectValue;