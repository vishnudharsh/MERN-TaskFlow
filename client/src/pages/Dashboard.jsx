import React from "react";
import clsx from "clsx";
import moment from "moment";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import {
  MdAdminPanelSettings,
  MdEditNote,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import Chart from "../components/Chart";
import Loading from "../components/Loading";
import UserInfo from "../components/UserInfo";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "./../utils/index";

const Card = ({ label, count, bg, icon }) => {
  return (
    <div className='w-full h-36 bg-white dark:bg-[#1f1f1f] p-6 shadow-lg rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
      <div className='h-full flex flex-1 flex-col justify-between'>
        <p className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>{label}</p>
        <span className='text-3xl font-bold text-gray-900 dark:text-white'>{count}</span>
        <span className='text-xs text-gray-400'>Last month</span>
      </div>
      <div
        className={clsx(
          "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md",
          bg
        )}
      >
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='bg-gray-50 dark:bg-gray-800/50'>
      <tr className='text-left'>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Task Title</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Priority</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Team</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/50 dark:hover:bg-gray-800/50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div
            className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='text-sm font-medium text-gray-900 dark:text-gray-200'>
            {task.title}
          </p>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div className={"flex gap-2 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize text-sm text-gray-600 dark:text-gray-400'>{task.priority}</span>
        </div>
      </td>
      <td className='py-4 px-4'>
        <div className='flex -space-x-2'>
          {task?.team?.map((m, index) => (
            <div
              key={index}
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
      <td className='py-4 px-4 hidden md:table-cell'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {moment(task?.date || task?.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-2/3 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden'>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
      </div>
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks && tasks.length > 0 ? (
              tasks.map((task, id) => <TableRow key={id} task={task} />)
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='bg-gray-50 dark:bg-gray-800/50'>
      <tr className='text-left'>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Full Name</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Status</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Created</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-100 dark:border-gray-800 hover:bg-secondary-50/50 dark:hover:bg-gray-800/50 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-medium bg-gradient-to-br from-primary-500 to-secondary-500'>
            <span>{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-900 dark:text-white'>{user.name}</p>
            <span className='text-xs text-gray-500 dark:text-gray-400 capitalize'>{user.role}</span>
          </div>
        </div>
      </td>
      <td className='py-4 px-4'>
        <span
          className={clsx(
            "inline-flex px-3 py-1 rounded-full text-xs font-medium",
            user.isActive 
              ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400" 
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          )}
        >
          {user.isActive ? "Active" : "Disabled"}
        </span>
      </td>
      <td className='py-4 px-4'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {moment(user.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden'>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Members</h3>
      </div>
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={index + user?._id} user={user} />
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error, isError } = useGetDasboardStatsQuery();

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-500 font-semibold'>Error loading dashboard data</p>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          {error?.data?.message || error?.error || "Please check console for details"}
        </p>
      </div>
    );
  }

  const totals = data?.tasks || {};

  const stats = [
    {
      _id: "1",
      label: "Total Tasks",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-gradient-to-br from-primary-500 to-primary-600",
    },
    {
      _id: "2",
      label: "Completed",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-gradient-to-br from-secondary-500 to-secondary-600",
    },
    {
      _id: "3",
      label: "In Progress",
      total: totals["in progress"] || 0,
      icon: <MdEditNote />,
      bg: "bg-gradient-to-br from-accent-500 to-accent-600",
    },
    {
      _id: "4",
      label: "To Do",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className='h-full py-6 px-4 md:px-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      {/* Chart Section */}
      <div className='w-full bg-white dark:bg-[#1f1f1f] my-8 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800'>
        <h4 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Tasks by Priority
        </h4>
        <Chart data={data?.graphData} />
      </div>

      {/* Tables Section */}
      <div className='w-full flex flex-col md:flex-row gap-6'>
        <TaskTable tasks={data?.last10Task} />
        <UserTable users={data?.users} />
      </div>
    </div>
  );
};

export default Dashboard;