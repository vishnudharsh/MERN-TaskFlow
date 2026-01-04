import React from 'react'
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = ({ tabs, setSelected, children }) => {
  return (
    <div className='w-full px-1 sm:px-0'>
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-white dark:bg-[#1f1f1f] p-2 shadow-md border border-gray-200 dark:border-gray-800">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 outline-none",
                  selected
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
                )
              }
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='w-full mt-6'>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Tabs