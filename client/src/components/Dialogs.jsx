import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const isRestore = type === "restore" || type === "restoreAll";

  return (
    <ModalWrapper open={open} setOpen={closeDialog}>
      <div className='py-6 w-full flex flex-col gap-6 items-center justify-center'>
        <Dialog.Title as='h3'>
          <div
            className={clsx(
              "p-4 rounded-full shadow-lg",
              isRestore
                ? "bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30"
                : "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30"
            )}
          >
            {isRestore ? (
              <MdWarning
                className={clsx(
                  "text-secondary-600 dark:text-secondary-400"
                )}
                size={48}
              />
            ) : (
              <FaQuestion
                className="text-red-600 dark:text-red-400"
                size={48}
              />
            )}
          </div>
        </Dialog.Title>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isRestore ? "Restore Item?" : "Confirm Deletion"}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 max-w-sm'>
            {msg ?? "Are you sure you want to delete the selected record? This action cannot be undone."}
          </p>
        </div>

        <div className='flex flex-col-reverse sm:flex-row gap-3 w-full'>
          <Button
            type='button'
            className='flex-1 px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
            onClick={closeDialog}
            label='Cancel'
          />

          <Button
            type='button'
            className={clsx(
              "flex-1 px-6 py-2.5 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200",
              isRestore
                ? "bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800"
                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            )}
            onClick={onClick}
            label={isRestore ? "Restore" : "Delete"}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}

export function UserAction({ 
  open, 
  setOpen, 
  onClick = () => {}, 
  message = "Are you sure you want to change this user's status?",
  isActive = true 
}) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={closeDialog}>
      <div className='py-6 w-full flex flex-col gap-6 items-center justify-center'>
        <Dialog.Title as='h3'>
          <div
            className={clsx(
              "p-4 rounded-full shadow-lg",
              isActive 
                ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30"
                : "bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30"
            )}
          >
            <FaQuestion
              className={clsx(
                isActive 
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-primary-600 dark:text-primary-400"
              )}
              size={48}
            />
          </div>
        </Dialog.Title>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isActive ? "Deactivate User?" : "Activate User?"}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 max-w-sm'>
            {message}
          </p>
        </div>

        <div className='flex flex-col-reverse sm:flex-row gap-3 w-full'>
          <Button
            type='button'
            className='flex-1 px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
            onClick={closeDialog}
            label='Cancel'
          />

          <Button
            type='button'
            className={clsx(
              "flex-1 px-6 py-2.5 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200",
              isActive 
                ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            )}
            onClick={onClick}
            label='Confirm'
          />
        </div>
      </div>
    </ModalWrapper>
  );
}