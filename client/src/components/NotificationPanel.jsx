import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { toast } from "sonner";
import { useGetNotificationsQuery, useMarkNotiAsReadMutation } from "../redux/slices/api/userApiSlice";
import ViewNotification from './ViewNotification';

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-red-600 dark:text-red-400' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-primary-600 dark:text-primary-400' />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();

  const viewHandler = (el) => {
    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const readHandler = async (type, id) => {
    try {
      await markAsRead({ type, id }).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to mark as read");
    }
  };

  const callsToAction = [
    { name: "Cancel", href: "#" },
    {
      name: "Mark All Read",
      href: "#",
      onClick: () => readHandler("all", ""),
    },
  ];

  const notifications = Array.isArray(data) ? data : data?.notice || [];

  return (
    <>
      <Popover className='relative'>
        <Popover.Button className='inline-flex items-center outline-none group'>
          <div className='w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 relative rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-all'>
            <IoIosNotificationsOutline className='text-2xl' />
            {notifications?.length > 0 && (
              <span className='absolute -top-1 -right-1 flex items-center justify-center text-xs text-white font-bold w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg border-2 border-white dark:border-gray-900'>
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </div>
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
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
            {({ close }) =>
              notifications?.length > 0 ? (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-2xl bg-white dark:bg-[#1f1f1f] text-sm shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 border border-gray-200 dark:border-gray-800'>
                  {/* Header */}
                  <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
                    <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                      Notifications
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      You have {notifications.length} unread notification{notifications.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Notifications List */}
                  <div className='max-h-96 overflow-y-auto'>
                    {notifications.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className='group relative flex gap-x-4 p-4 hover:bg-primary-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0'
                        onClick={() => viewHandler(item)}
                      >
                        <div className='mt-1 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex-shrink-0'>
                          {ICONS[item.notiType] || ICONS.alert}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between gap-2 mb-1'>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white capitalize'>
                              {item.notiType || "Alert"}
                            </p>
                            <span className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className='grid grid-cols-2 border-t border-gray-200 dark:border-gray-800'>
                    {callsToAction.map((item) => (
                      <button
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className='flex items-center justify-center gap-x-2 p-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors first:border-r border-gray-200 dark:border-gray-800'
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-2xl bg-white dark:bg-[#1f1f1f] text-sm shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 border border-gray-200 dark:border-gray-800'>
                  <div className='p-12 text-center'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center'>
                      <IoIosNotificationsOutline className='text-4xl text-primary-600 dark:text-primary-400' />
                    </div>
                    <p className='text-base font-semibold text-gray-900 dark:text-white mb-2'>
                      All caught up!
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      No new notifications
                    </p>
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>

      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  );
};

export default NotificationPanel;