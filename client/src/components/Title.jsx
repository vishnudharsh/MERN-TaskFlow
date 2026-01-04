import React from 'react'
import clsx from 'clsx';

const Title = ({ title, className }) => {
  return (
    <h2
      className={clsx(
        "text-2xl font-bold text-gray-900 dark:text-white capitalize",
        className
      )}
    >
      {title}
    </h2>
  )
}

export default Title