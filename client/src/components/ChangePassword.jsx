import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { FaLock } from "react-icons/fa";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();
  const password = watch("password");

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords don't match");
      return;
    }
    try {
      const res = await changeUserPassword(data).unwrap();
      toast.success("Password changed successfully");

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-6'>
        <Dialog.Title
          as='h2'
          className='text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center gap-3'
        >
          <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-lg">
            <FaLock className="text-primary-600 dark:text-primary-400" />
          </div>
          Change Password
        </Dialog.Title>

        <div className='space-y-5'>
          <div className='bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              <span className="font-semibold">Security Tip:</span> Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
            </p>
          </div>

          <Textbox
            placeholder='Enter new password'
            type='password'
            name='password'
            label='New Password'
            className='w-full rounded-lg'
            register={register("password", {
              required: "New password is required!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            error={errors.password ? errors.password.message : ""}
          />

          <Textbox
            placeholder='Confirm new password'
            type='password'
            name='cpass'
            label='Confirm New Password'
            className='w-full rounded-lg'
            register={register("cpass", {
              required: "Please confirm your password!",
              validate: value => value === password || "Passwords don't match"
            })}
            error={errors.cpass ? errors.cpass.message : ""}
          />
        </div>

        {isLoading ? (
          <div className='py-8'>
            <Loading />
          </div>
        ) : (
          <div className='flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <Button
              type='button'
              className='w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
              onClick={() => setOpen(false)}
              label='Cancel'
            />

            <Button
              type='submit'
              className='flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
              label='Update Password'
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;