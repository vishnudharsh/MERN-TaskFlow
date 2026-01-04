import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp, MdAttachFile } from 'react-icons/md';
import { BiMessageAltDetail } from 'react-icons/bi';
import { toast } from "sonner";
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from '../../utils';
import clsx from 'clsx';
import { FaList } from 'react-icons/fa';
import UserInfo from '../UserInfo';
import Button from '../Button';
import ConfirmatioDialog from '../Dialogs';
import AddTask from './AddTask';
import { useTrashTaskMutation } from '../../redux/slices/api/taskApiSlice';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [trashTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (task) => {
    setSelected(task);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await trashTask(selected).unwrap();
      toast.success(res?.message || "Task moved to trash successfully");
      setOpenDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Failed to delete task");
    }
  };

  const TableHeader = () => (
    <thead className='bg-gray-50 dark:bg-gray-800/50'>
      <tr className='text-left'>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Task Title</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Priority</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell'>Created At</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Assets</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Team</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/50 dark:hover:bg-gray-800/50 transition-colors">
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className={clsx("w-3 h-3 rounded-full flex-shrink-0", TASK_TYPE[task.stage])} />
          <p className='text-sm font-medium text-gray-900 dark:text-gray-200 line-clamp-2'>
            {task?.title}
          </p>
        </div>
      </td>

      <td className='py-4 px-4'>
        <div className="flex gap-2 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize text-sm text-gray-600 dark:text-gray-400'>{task?.priority}</span>
        </div>
      </td>

      <td className='py-4 px-4 hidden md:table-cell'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <BiMessageAltDetail />
            <span>{task?.activities?.length || 0}</span>
          </div>
          <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <MdAttachFile />
            <span>{task?.assets?.length || 0}</span>
          </div>
          <div className="flex gap-1.5 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <FaList />
            <span>{task?.subTasks?.length || 0}</span>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex -space-x-2">
          {task?.team?.map((m, index) => (
            <div 
              key={m._id} 
              className={clsx(
                "w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-900", 
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className='py-4 px-4'>
        <div className='flex gap-3 justify-end'>
          <button
            className='text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors'
            onClick={() => editClickHandler(task)}
          >
            Edit
          </button>
          <button
            className='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors'
            onClick={() => deleteClicks(task._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TableRow key={task._id || index} task={task} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <p className="text-lg text-gray-500 dark:text-gray-400">No tasks available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
        msg="Do you want to move this task to trash?"
      />
    </>
  );
};

export default Table;