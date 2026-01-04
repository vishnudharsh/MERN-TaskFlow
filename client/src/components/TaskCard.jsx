import React, { useState } from 'react'
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import TaskDialog from './task/TaskDialog';
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from './../utils/index';
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from 'react-icons/fa';
import UserInfo from './UserInfo';
import { IoMdAdd } from 'react-icons/io';
import AddSubTask from './task/AddSubTask';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, refetch }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-lg hover:shadow-xl transition-all duration-300 p-5 rounded-xl border border-gray-100 dark:border-gray-800 hover:-translate-y-1'>
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-4">
          <div className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold",
            PRIOTITYSTYELS[task?.priority],
            task?.priority === 'high' && 'bg-red-50 dark:bg-red-900/20',
            task?.priority === 'medium' && 'bg-amber-50 dark:bg-amber-900/20',
            task?.priority === 'low' && 'bg-blue-50 dark:bg-blue-900/20'
          )}>
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase text-xs tracking-wide'>{task?.priority}</span>
          </div>
          <TaskDialog task={task} refetch={refetch} />
        </div>

        {/* Task Title */}
        <div className='flex items-center gap-3 mb-3'>
          <div className={clsx("w-3 h-3 rounded-full flex-shrink-0", TASK_TYPE[task.stage])} />
          <h4 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {task?.title}
          </h4>
        </div>

        {/* Date */}
        <span className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1'>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(new Date(task?.date))}
        </span>

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-4' />

        {/* Stats */}
        <div className='flex items-center justify-between mb-4'>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <BiMessageAltDetail className="text-base" />
              <span className="font-medium">{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <MdAttachFile className="text-base" />
              <span className="font-medium">{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <FaList className="text-sm" />
              <span className="font-medium">{task?.subTasks?.length || 0}</span>
            </div>
          </div>

          {/* Team Avatars */}
          <div className='flex -space-x-2'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-900",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tasks section */}
        {task?.subTasks?.length > 0 ? (
          <div className='py-3 border-t border-gray-200 dark:border-gray-700'>
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              {task?.subTasks[0].title}
            </h5>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className="bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full text-primary-700 dark:text-primary-400 text-xs font-medium">
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 border-t border-gray-200 dark:border-gray-700">
            <span className='text-sm text-gray-400 dark:text-gray-500'>No Sub Task</span>
          </div>
        )}

        {/* Add Subtask Button */}
        <div className='w-full pt-2'>
          <button
            disabled={!user?.isAdmin}
            onClick={() => setOpen(true)}
            className={clsx(
              'w-full flex gap-2 items-center justify-center text-sm font-semibold py-2 px-4 rounded-lg transition-all',
              user?.isAdmin
                ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            )}
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;