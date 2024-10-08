// src/components/ui/dropdown-menu.jsx
import { Menu } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export function DropdownMenu({ children }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
}

export function DropdownMenuTrigger({ children }) {
  return (
    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
      {children}
      <ChevronDown className="w-5 h-5 ml-2 -mr-1" />
    </Menu.Button>
  );
}

export function DropdownMenuContent({ children }) {
  return (
    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">{children}</div>
    </Menu.Items>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active ? 'bg-indigo-500 text-white' : 'text-gray-900'
          } group flex items-center w-full px-4 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}
