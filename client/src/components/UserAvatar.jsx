import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import { toast } from "sonner";
import AddUser from './AddUser';
import ChangePassword from './ChangePassword';

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/log-in");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <Menu.Button className='w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-md hover:shadow-lg ring-2 ring-white dark:ring-gray-800'>
              <span className='text-white font-semibold text-sm 2xl:text-base'>
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-[#1f1f1f] shadow-xl ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* User Info Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                  {user?.role || 'User'}
                </span>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={`${
                        active ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                      } group flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors`}
                    >
                      <FaUser className='text-base' aria-hidden='true' />
                      Edit Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`${
                        active ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                      } group flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors`}
                    >
                      <FaUserLock className='text-base' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`${
                        active ? 'bg-red-50 dark:bg-red-900/20' : ''
                      } text-red-600 dark:text-red-400 group flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors`}
                    >
                      <IoLogOutOutline className='text-lg' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;