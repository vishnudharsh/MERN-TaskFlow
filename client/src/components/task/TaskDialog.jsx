import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AiTwotoneFolderOpen } from 'react-icons/ai';
import { MdAdd, MdOutlineEdit } from 'react-icons/md';
import { HiDuplicate } from 'react-icons/hi';
import { BsThreeDots } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import clsx from 'clsx';
import AddTask from './AddTask';
import AddSubTask from './AddSubTask';
import ConfirmatioDialog from '../Dialogs';
import { 
  useDuplicateTaskMutation, 
  useTrashTaskMutation 
} from '../../redux/slices/api/taskApiSlice';

const TaskDialog = ({ task, refetch }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [duplicateTask, { isLoading: isDuplicating }] = useDuplicateTaskMutation();
  const [trashTask] = useTrashTaskMutation();

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message || "Task duplicated successfully");
      
      if (refetch) {
        refetch();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Failed to duplicate task");
    }
  };

  const deleteClickHandler = () => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await trashTask(task._id).unwrap();
      toast.success(res?.message || "Task moved to trash successfully");
      
      setOpenDialog(false);
      
      if (refetch) {
        refetch();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Failed to delete task");
    }
  };

  // ✅ Define menu items based on user role
  const allItems = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => navigate(`/task/${task._id}`),
      adminOnly: false, // Available to everyone
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpenEdit(true),
      adminOnly: true, // Admin only
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpen(true),
      adminOnly: true, // Admin only
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: duplicateHandler,
      adminOnly: true, // Admin only
    },
  ];

  // ✅ Filter items: Show only "Open Task" for non-admins, show all for admins
  const items = user?.isAdmin 
    ? allItems 
    : allItems.filter(item => !item.adminOnly);

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className='inline-flex items-center justify-center rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none'>
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-[#1f1f1f] shadow-lg ring-1 ring-black/5 focus:outline-none p-2 z-50'>
              <div className='px-1 py-1 space-y-2'>
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        disabled={el.label === "Duplicate" && isDuplicating}
                        className={clsx(
                          active ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-gray-300",
                          "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50"
                        )}
                      >
                        {el.icon}
                        {el.label === "Duplicate" && isDuplicating ? "Duplicating..." : el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
              
              {/* ✅ Show Delete option only for admins */}
              {user?.isAdmin && (
                <div className='px-1 py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={deleteClickHandler}
                        className={clsx(
                          active ? "bg-red-100 text-red-900" : "text-red-900",
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                        )}
                      >
                        <RiDeleteBin6Line
                          className='mr-2 h-5 w-5 text-red-600'
                          aria-hidden='true'
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        onSuccess={refetch}
        key={new Date().getTime()}
      />
      <AddSubTask 
        open={open} 
        setOpen={setOpen} 
        id={task._id}
        onSuccess={refetch}
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

export default TaskDialog;
