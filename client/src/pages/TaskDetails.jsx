import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import { getInitials, PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import Loading from './../components/Loading';
import Button from './../components/Button';
import { useGetSingleTaskQuery, usePostTaskActivityMutation } from "../redux/slices/api/taskApiSlice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white shadow-md">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white shadow-md">
      <FaUser size={16} />
    </div>
  ),
  bug: (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
      <FaBug size={20} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch, task }) => {
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const isTeamMember = task?.team?.some((member) => member._id === user._id);
  const canAddActivity = user?.isAdmin || isTeamMember;

  const handleSubmit = async () => {
    try {
      if (!text.trim()) {
        toast.error("Please enter activity description");
        return;
      }

      const activityData = {
        type: selected.toLowerCase(),
        activity: text,
      };

      const res = await postActivity({ id, data: activityData }).unwrap();
      toast.success(res?.message || "Activity added successfully");
      
      setText("");
      setSelected(act_types[0]);
      if (refetch) refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Failed to add activity");
    }
  };

  const Card = ({ item }) => {
    return (
      <div className="flex gap-4">
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='flex items-center justify-center'>
            {TASKTYPEICON[item?.type]}
          </div>
          <div className='flex-1 w-0.5 bg-gradient-to-b from-primary-200 to-transparent dark:from-primary-800 mt-2'></div>
        </div>

        <div className='flex flex-col gap-2 mb-8 flex-1'>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-gray-900 dark:text-white'>{item?.by?.name || "Unknown User"}</p>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {moment(item?.date).fromNow()}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='capitalize text-sm font-medium text-primary-600 dark:text-primary-400'>
              {item?.type}
            </span>
          </div>
          <p className='text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
            {item?.activity}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex flex-col lg:flex-row gap-8 min-h-screen px-6 py-8 bg-white dark:bg-[#1f1f1f] shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 overflow-y-auto'>
      <div className='flex-1'>
        <h4 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2'>
          <RxActivityLog className="text-primary-600 dark:text-primary-400" />
          Activity Timeline
        </h4>
        <div className='space-y-0'>
          {activity && activity.length > 0 ? (
            activity.map((el, index) => (
              <Card key={index} item={el} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No activities yet</p>
            </div>
          )}
        </div>
      </div>
      
      <div className='w-full lg:w-96 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800'>
        <h4 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
          Add Activity
        </h4>
        
        {canAddActivity ? (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Activity Type</label>
              <div className='flex flex-wrap gap-2'>
                {act_types.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelected(item)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      selected === item
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary-500'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Description</label>
              <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Describe the activity...'
                className='w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none'
              />
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='button'
                label='Submit Activity'
                onClick={handleSubmit}
                className='w-full py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
              />
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              ⚠️ You don't have permission to add activities. Only assigned team members can add activities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskDetails = () => {
  const { id } = useParams();
  const [selected, setSelected] = useState(0);

  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">Task not found</p>
      </div>
    );
  }

  const task = data?.task || data;

  const priorityColors = {
    high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  };

  return (
    <div className="w-full flex flex-col gap-6 mb-4 overflow-y-hidden">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{task?.title}</h1>
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <div className="w-full bg-white dark:bg-[#1f1f1f] shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
                    priorityColors[task?.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[task?.priority]}</span>
                  <span className="uppercase">{task?.priority} Priority</span>
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task?.stage])} />
                  <span className="uppercase text-sm font-semibold text-gray-900 dark:text-white">{task?.stage}</span>
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <span className='font-medium'>Created:</span>
                <span>{new Date(task?.date).toDateString()}</span>
              </div>

              <div className='flex items-center gap-8 py-4 border-y border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-gray-900 dark:text-white'>Assets:</span>
                  <span className="text-gray-600 dark:text-gray-400">{task?.assets?.length || 0}</span>
                </div>
                <div className='w-px h-6 bg-gray-300 dark:bg-gray-700'></div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-gray-900 dark:text-white'>Sub-Tasks:</span>
                  <span className="text-gray-600 dark:text-gray-400">{task?.subTasks?.length || 0}</span>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Task Team</h3>
                <div className='space-y-3'>
                  {task?.team && task.team.length > 0 ? (
                    task.team.map((m, index) => (
                      <div
                        key={index}
                        className='flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors'
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {getInitials(m?.name)}
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900 dark:text-white'>{m?.name}</p>
                          <span className='text-sm text-gray-600 dark:text-gray-400'>{m?.title || m?.role}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No team members assigned</p>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Sub-Tasks</h3>
                <div className='space-y-4'>
                  {task?.subTasks && task.subTasks.length > 0 ? (
                    task.subTasks.map((el, index) => (
                      <div key={index} className='flex gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                        <div className='w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex-shrink-0'>
                          <MdTaskAlt className='text-primary-600 dark:text-primary-400' size={24} />
                        </div>

                        <div className='flex-1 space-y-2'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              {new Date(el?.date).toDateString()}
                            </span>
                            <span className='px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'>
                              {el?.tag}
                            </span>
                          </div>
                          <p className='text-gray-900 dark:text-gray-200'>{el?.title}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No subtasks</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Assets */}
            <div className="w-full lg:w-96 space-y-6">
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Assets</h3>
              <div className='grid grid-cols-2 gap-4'>
                {task?.assets && task.assets.length > 0 ? (
                  task.assets.map((el, index) => (
                    <img
                      key={index}
                      src={el}
                      alt={task?.title}
                      className='w-full h-32 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-800'
                    />
                  ))
                ) : (
                  <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">No assets</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Activities activity={task?.activities} id={id} refetch={refetch} task={task} />
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetails;