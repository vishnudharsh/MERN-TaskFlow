import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from 'react-icons/md';
import { getInitials } from '../../utils';
import { useGetTeamListQuery } from '../../redux/slices/api/userApiSlice';

const UserList = ({ setTeam, team }) => {
  const { data, isLoading } = useGetTeamListQuery();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = Array.isArray(data) ? data : data?.users || [];

  const handleChange = (el) => {
    setSelectedUsers(el);
    setTeam(el?.map((u) => u._id));
  };

  useEffect(() => {
    if (team?.length < 1) {
      users && users.length > 0 && setSelectedUsers([users[0]]);
    } else {
      setSelectedUsers(team);
    }
  }, [users]);

  if (isLoading) {
    return (
      <div className='space-y-2'>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Assign Task To
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 py-3 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          Loading team members...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className='space-y-2'>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Assign Task To
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 py-3 px-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          ⚠️ No team members available
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Assign Task To
      </label>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className='relative'>
          <Listbox.Button className='relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-900 py-2.5 pl-4 pr-10 text-left border border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm'>
            <span className='block truncate text-gray-900 dark:text-white'>
              {selectedUsers?.length > 0 
                ? selectedUsers.map((user) => user.name).join(", ")
                : "Select team members"}
            </span>

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
              {users.map((user, userIdx) => (
                <Listbox.Option
                  key={user._id || userIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                      active 
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100" 
                        : "text-gray-900 dark:text-gray-300"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-3 ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0">
                          <span className='text-xs'>
                            {getInitials(user?.name)}
                          </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='truncate'>{user?.name}</p>
                          <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                            {user?.role} • {user?.title || 'No title'}
                          </p>
                        </div>
                      </div>
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

      {/* Selected users preview */}
      {selectedUsers?.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-3'>
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className='inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg border border-primary-200 dark:border-primary-800 text-sm'
            >
              <div className='w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-medium'>
                {getInitials(user?.name)}
              </div>
              <span className='font-medium'>{user?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;