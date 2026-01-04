import React from 'react';
import clsx from 'clsx';

const TaskTitle = ({ label, className, count = 0 }) => {
  return (
    <div className='w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          <div className={clsx("w-4 h-4 rounded-full shadow-md", className)} />
          <p className='text-sm font-semibold text-gray-900 dark:text-gray-200'>
            {label}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <span className='inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300'>
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskTitle;