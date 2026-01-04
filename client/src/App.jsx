import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import TaskDetails from "./pages/TaskDetails";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Fragment, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Transition } from '@headlessui/react';
import { setOpenSidebar } from "./redux/slices/authSlice";
import Tasks from "./pages/Tasks";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-[#0d0d0d]">
      {/* Desktop Sidebar */}
      <div className="w-64 h-screen bg-white dark:bg-[#1f1f1f] sticky top-0 hidden md:block border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <Transition
      show={isSidebarOpen}
      as={Fragment}
      enter='transition-opacity duration-300'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-300'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div
        className='md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
        onClick={closeSidebar}
      >
        <Transition.Child
          as={Fragment}
          enter='transition ease-in-out duration-300 transform'
          enterFrom='-translate-x-full'
          enterTo='translate-x-0'
          leave='transition ease-in-out duration-300 transform'
          leaveFrom='translate-x-0'
          leaveTo='-translate-x-full'
        >
          <div
            ref={mobileMenuRef}
            className='bg-white dark:bg-[#1f1f1f] w-80 max-w-[85%] h-full shadow-2xl overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className='flex justify-end px-4 pt-4'>
              <button
                onClick={closeSidebar}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors'
                aria-label='Close sidebar'
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className='px-2'>
              <Sidebar />
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/team" element={<Users />} />
        </Route>
        <Route path="/log-in" element={<Login />} />
      </Routes>

      {/* Toast Notifications with Teal Theme */}
      <Toaster 
        richColors 
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
          },
          className: 'dark:bg-gray-900 dark:text-white dark:border-gray-700',
        }}
      />
    </main>
  );
}