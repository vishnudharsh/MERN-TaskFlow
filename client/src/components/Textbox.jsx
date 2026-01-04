import React from 'react'
import clsx from "clsx";

const Textbox = React.forwardRef(
  (
    { type, placeholder, label, className, labelClass, register, name, error },
    ref
  ) => {
    return (
      <div className='w-full flex flex-col gap-2'>
        {label && (
          <label
            htmlFor={name}
            className={clsx(
              "text-sm font-medium text-gray-700 dark:text-gray-300",
              labelClass
            )}
          >
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={clsx(
              "w-full px-4 py-2.5 bg-white dark:bg-gray-900 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none text-sm transition-all",
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              className
            )}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className='text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1'>
            <span>⚠</span>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Textbox;