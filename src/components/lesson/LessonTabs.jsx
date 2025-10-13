import React from 'react';
import { Button } from '../ui/button';

const LessonTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="fixed top-20 left-0 right-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 z-40">
    <div className="mx-auto px-0">
      <div className="flex items-center justify-center h-20">
        <div className="flex items-center gap-4">
          {tabs.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => setActiveTab(id)}
              className={activeTab === id ? 'text-blue-500 bg-gray-300' : 'text-gray-700 bg-gray-300'}
            >
              <Icon className="w-5 h-5" />
              <span className="mx-2 hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>

);
};

export default LessonTabs;