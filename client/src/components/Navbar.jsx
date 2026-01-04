import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch } from "react-redux";
import UserAvatar from "./UserAvatar";
import NotificationPanel from './NotificationPanel';
import { setOpenSidebar } from "../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 2xl:py-4">
        {/* Left cluster: toggle + search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Toggle (mobile only) */}
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden transition-colors"
            aria-label="Open sidebar"
            type="button"
          >
            ☰
          </button>

          {/* Search – grows to fill, capped width */}
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <MdOutlineSearch className="text-xl" />
            </span>
            <input
              type="search"
              placeholder="Search tasks..."
              className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-100 transition-all"
            />
          </div>
        </div>

        {/* Right cluster: notifications + avatar */}
        <div className="flex items-center gap-3">
          <NotificationPanel />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}