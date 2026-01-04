import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import TaskTitle from '../components/TaskTitle';
import BoardView from '../components/BoardView';
import Table from '../components/task/Table';
import AddTask from '../components/task/AddTask';
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-primary-600",
  "in progress": "bg-accent-600",
  completed: "bg-secondary-600"
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  const tasks = Array.isArray(data) ? data : data?.tasks || [];

  const tasksCount = {
    todo: tasks.filter(t => t.stage === "todo").length,
    "in progress": tasks.filter(t => t.stage === "in progress").length,
    completed: tasks.filter(t => t.stage === "completed").length,
  };

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className='flex items-center justify-between mb-6'>
        <Title title={status ? `${status} Tasks` : "All Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-2 items-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg px-5 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200'
          />
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <TaskTitle 
                label='To Do' 
                className={TASK_TYPE.todo}
                count={tasksCount.todo}
              />
              <TaskTitle 
                label='In Progress' 
                className={TASK_TYPE["in progress"]}
                count={tasksCount["in progress"]}
              />
              <TaskTitle 
                label='Completed' 
                className={TASK_TYPE.completed}
                count={tasksCount.completed}
              />
            </div>
          )}

          {selected === 0 ? (
            <BoardView tasks={tasks} />
          ) : (
            <div className='w-full'>
              <Table tasks={tasks} />
            </div>
          )}
        </Tabs>
      </div>

      <AddTask 
        open={open} 
        setOpen={setOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Tasks;