import { Listbox, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { BsChevronExpand } from 'react-icons/bs'
import { MdCheck } from 'react-icons/md'

const SelectList = ({ lists, selected, setSelected, label }) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          {label}
        </label>
      )}
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative'>
          <Listbox.Button className='relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-900 py-2.5 pl-4 pr-10 text-left border border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm text-gray-900 dark:text-white'>
            <span className='block truncate'>{selected}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
              <BsChevronExpand
                className='h-4 w-4 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-200 dark:border-gray-800'>
              {lists.map((list, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${
                      active 
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100" 
                        : "text-gray-900 dark:text-gray-300"
                    }`
                  }
                  value={list}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate text-sm ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {list}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400'>
                          <MdCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default SelectList