import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ModalWrapper from '../ModalWrapper';
import { Dialog } from '@headlessui/react';
import Textbox from '../Textbox';
import Button from '../Button';
import { useCreateSubTaskMutation } from '../../redux/slices/api/taskApiSlice';
import Loading from '../Loading';

const AddSubTask = ({ open, setOpen, id, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSubTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      console.log("Adding subtask:", { data, taskId: id });

      const res = await addSubTask({ data, id }).unwrap();
      toast.success(res?.message || "Sub-task added successfully");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Failed to add sub-task");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-6'>
        <Dialog.Title
          as='h2'
          className='text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4'
        >
          Add Sub-Task
        </Dialog.Title>

        <div className='space-y-5'>
          <Textbox
            placeholder='Enter sub-task title'
            type='text'
            name='title'
            label='Sub-Task Title'
            className='w-full rounded-lg'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Textbox
              placeholder='Select date'
              type='date'
              name='date'
              label='Due Date'
              className='w-full rounded-lg'
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />
            
            <Textbox
              placeholder='e.g., Frontend, API, Testing'
              type='text'
              name='tag'
              label='Tag'
              className='w-full rounded-lg'
              register={register("tag", {
                required: "Tag is required!",
              })}
              error={errors.tag ? errors.tag.message : ""}
            />
          </div>
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
              label='Add Sub-Task'
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;