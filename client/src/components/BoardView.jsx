import React from 'react'
import TaskCard from './TaskCard';

const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-6'>
      {tasks && tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskCard task={task} key={index} />
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <p className="text-lg text-gray-500 dark:text-gray-400">No tasks available</p>
        </div>
      )}
    </div>
  )
}

export default BoardView