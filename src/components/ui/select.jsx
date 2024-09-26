import React, { createContext, useContext, useState } from 'react';

const SelectContext = createContext();

export const Select = ({ children, onValueChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, onValueChange, value }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const useSelectContext = () => useContext(SelectContext);

export default Select;