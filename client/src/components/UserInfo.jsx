import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { getInitials } from './../utils/index';
import { Fragment } from 'react';

const UserInfo = ({ user }) => {
  return (
    <div className='px-4'>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="group inline-flex items-center outline-none">
              <span className='w-full h-full flex items-center justify-center'>
                {getInitials(user?.name)}
              </span>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute left-1/2 z-10 mt-3 w-80 max-w-sm -translate-x-1/2 transform px-4 sm:px-0'>
                <div className='flex items-center gap-4 rounded-xl shadow-2xl bg-white dark:bg-[#1f1f1f] p-6 border border-gray-200 dark:border-gray-800'>
                  <div className='w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-lg'>
                    {getInitials(user?.name)}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-gray-900 dark:text-white text-lg font-bold'>
                      {user?.name}
                    </p>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      {user?.title || user?.role}
                    </span>
                    <span className='text-sm text-primary-600 dark:text-primary-400 font-medium'>
                      {user?.email ?? "email@example.com"}
                    </span>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default UserInfo;