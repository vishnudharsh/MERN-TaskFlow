import React, { useState } from 'react';
import ModalWrapper from './../ModalWrapper';
import { Dialog } from '@headlessui/react';
import Textbox from './../Textbox';
import { useForm } from 'react-hook-form';
import { BiImages } from "react-icons/bi";
import UserList from './UserList';
import SelectList from '../SelectList';
import Button from './../Button';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const submitHandler = async (data) => {
    try {
      const newData = {
        ...data,
        team,
        stage: stage.toLowerCase(),
        priority: priority.toLowerCase(),
        assets: [], 
      };

      console.log("Submitting task:", newData); 

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res?.message || "Task created successfully");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Something went wrong");
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)} className='space-y-6'>
        <Dialog.Title
          as='h2'
          className='text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4'
        >
          {task?._id ? "Update Task" : "Create New Task"}
        </Dialog.Title>

        <div className='space-y-5'>
          <Textbox
            placeholder='Enter task title'
            type='text'
            name='title'
            label='Task Title'
            className='w-full rounded-lg'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectList
              label='Task Stage'
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
            <Textbox
              placeholder='Select date'
              type='date'
              name='date'
              label='Task Date'
              className='w-full rounded-lg'
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectList
              label='Priority Level'
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />
            <div className='flex items-center justify-center'>
              <label
                className='flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 cursor-pointer transition-colors font-medium'
                htmlFor='imgUpload'
              >
                <input
                  type='file'
                  className='hidden'
                  id='imgUpload'
                  onChange={(e) => handleSelect(e)}
                  accept='.jpg, .png, .jpeg'
                  multiple={true}
                />
                <BiImages className='text-xl' />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          {assets.length > 0 && (
            <div className='bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg'>
              <p className='text-sm text-primary-700 dark:text-primary-300'>
                {assets.length} file(s) selected
              </p>
            </div>
          )}
        </div>

        <div className='flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button
            type='button'
            className='w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
            onClick={() => setOpen(false)}
            label='Cancel'
          />
          
          {uploading ? (
            <span className='flex-1 text-center py-2.5 text-primary-600 dark:text-primary-400 font-medium'>
              Uploading assets...
            </span>
          ) : (
            <Button
              label={task?._id ? 'Update Task' : 'Create Task'}
              type='submit'
              className='flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading || isUpdating}
            />
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;