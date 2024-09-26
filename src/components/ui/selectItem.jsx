import React from 'react';
import { useSelectContext } from './select';

const SelectItem = ({ children, value }) => {
  const { onValueChange, setIsOpen } = useSelectContext();

  const handleClick = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
      role="menuitem"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default SelectItem;