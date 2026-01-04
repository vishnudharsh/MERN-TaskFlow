import React from "react";
import clsx from "clsx";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
  MdSettings,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import Logo from './Logo';

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
            : "text-gray-700 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
        )}
      >
        <span className={clsx(
          "text-xl transition-transform group-hover:scale-110",
          isActive && "text-white"
        )}>
          {el.icon}
        </span>
        <span className={clsx(
          "font-medium text-sm",
          isActive ? "text-white" : "group-hover:text-primary-600 dark:group-hover:text-primary-400"
        )}>
          {el.label}
        </span>
      </Link>
    );
  };

  return (
    <div className='w-full h-full flex flex-col p-5'>
      {/* Logo */}
      <div className='mb-8'>
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className='flex-1 flex flex-col gap-2 py-4'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* Settings Button */}
      <div className='pt-4 border-t border-gray-200 dark:border-gray-800'>
        <button className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'>
          <MdSettings className='text-xl' />
          <span className='font-medium text-sm'>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;