import React from 'react';
import { Button } from '../ui/button';

const LessonFooter = ({ handleNavigation, t, isNextAvailable, isNavigating, isLoadingNextLesson, lessonId }) => (
    <div className="left-0 right-0 bg-white dark:bg-slate-800 border-t dark:border-slate-700 p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => handleNavigation('previous')}
            disabled={parseInt(lessonId) === 1 || isLoadingNextLesson}
            className="w-24 bg-gray-700 hover:bg-gray-800 text-white hover:border-blue-700"
          >
            {isLoadingNextLesson ? (
              <span className="animate-spin border-2 border-slate-500 border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              t('Previous')
            )}
          </Button>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('For the next lesson, complete the exam first.')}
          </div>
          <Button
            onClick={() => handleNavigation('next')}
            disabled={!isNextAvailable || isNavigating || isLoadingNextLesson}
            className="w-24 flex items-center justify-center bg-gray-700 hoveer:bg-gray-800 text-white hover:border-blue-700"
          >
            {isLoadingNextLesson ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              t('Next')
            )}
          </Button>
        </div>
      </div>
      );

      export default LessonFooter;