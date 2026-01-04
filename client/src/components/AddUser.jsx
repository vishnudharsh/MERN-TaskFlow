import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { Dialog } from '@headlessui/react';
import Textbox from './Textbox';
import Loading from './Loading';
import Button from './Button';
import { useRegisterMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { useUpdateUserMutation } from '../redux/slices/api/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const dispatch = useDispatch();

  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const result = await updateUser(data).unwrap();
        toast.success("Profile updated successfully");

        if (userData?._id === user._id) {
          dispatch(setCredentials({ ...result.user }));
        }
      } else {
        const res = await addNewUser({
          ...data,
          password: data.password || undefined,
        }).unwrap();

        if (res.generatedPassword) {
          navigator.clipboard.writeText(res.generatedPassword);

          alert(
            `✅ User created successfully!\n\n` +
            `📧 Email: ${data.email}\n` +
            `🔑 Password: ${res.generatedPassword}\n\n` +
            `Password has been copied to clipboard!\n` +
            `Please share these credentials with the new user.`
          );

          toast.success(
            `User created! Password: ${res.generatedPassword}`,
            { duration: 8000 }
          );
        } else {
          toast.success(res.message || "User created successfully");
        }
      }

      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Something went wrong");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-6'>
        <Dialog.Title
          as='h2'
          className='text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4'
        >
          {userData ? "Update Profile" : "Add New User"}
        </Dialog.Title>

        <div className='space-y-5'>
          <Textbox
            placeholder='Enter full name'
            type='text'
            name='name'
            label='Full Name'
            className='w-full rounded-lg'
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />

          <Textbox
            placeholder='Enter job title'
            type='text'
            name='title'
            label='Job Title'
            className='w-full rounded-lg'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder='user@example.com'
            type='email'
            name='email'
            label='Email Address'
            className='w-full rounded-lg'
            register={register("email", {
              required: "Email is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />

          <Textbox
            placeholder='e.g., Manager, Developer'
            type='text'
            name='role'
            label='Role'
            className='w-full rounded-lg'
            register={register("role", {
              required: "Role is required!",
            })}
            error={errors.role ? errors.role.message : ""}
          />

          {!userData && (
            <div className='flex items-start gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800'>
              <span className='text-2xl'>💡</span>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                  Auto-Generated Password
                </p>
                <p className='text-xs text-gray-600 dark:text-gray-400'>
                  A secure password will be automatically generated and displayed after user creation. Make sure to save it!
                </p>
              </div>
            </div>
          )}
        </div>

        {isLoading || isUpdating ? (
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
              label={userData ? 'Update User' : 'Create User'}
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;