import React, { useState } from 'react';
import { toast } from 'sonner';
import Title from '../components/Title';
import Button from '../components/Button';
import { IoMdAdd } from 'react-icons/io';
import { getInitials } from '../utils';
import clsx from 'clsx';
import ConfirmatioDialog, { UserAction } from '../components/Dialogs';
import AddUser from '../components/AddUser';
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from '../redux/slices/api/userApiSlice';
import Loading from '../components/Loading';

const Users = () => {
  const { data, isLoading, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected).unwrap();
      refetch();
      toast.success(res?.message || "User deleted successfully");
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      }).unwrap();

      refetch();
      toast.success(res?.message || `User ${selected?.isActive ? 'deactivated' : 'activated'} successfully`);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const TableHeader = () => (
    <thead className='bg-gray-50 dark:bg-gray-800/50'>
      <tr className='text-left'>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Full Name</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Title</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Email</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Role</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300'>Status</th>
        <th className='py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-medium text-white shadow-md'>
            {getInitials(user?.name)}
          </div>
          <span className='text-sm font-medium text-gray-900 dark:text-white'>{user?.name}</span>
        </div>
      </td>
      <td className='py-4 px-4 text-sm text-gray-600 dark:text-gray-400'>{user?.title || "N/A"}</td>
      <td className='py-4 px-4 text-sm text-gray-600 dark:text-gray-400'>{user?.email || "user@email.com"}</td>
      <td className='py-4 px-4'>
        <span className='capitalize text-sm text-gray-600 dark:text-gray-400'>{user?.role || "N/A"}</span>
      </td>
      <td className='py-4 px-4'>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "inline-flex px-3 py-1 rounded-full text-xs font-medium transition-colors",
            user?.isActive 
              ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400 hover:bg-secondary-200" 
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className='py-4 px-4'>
        <div className='flex gap-3 justify-end'>
          <button
            className='text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors'
            onClick={() => editClick(user)}
          >
            Edit
          </button>
          <button
            className='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors'
            onClick={() => deleteClick(user?._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const teamList = Array.isArray(data) ? data : data?.users || [];

  return (
    <>
      <div className='w-full mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <Title title='Team Members' />

          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-2 items-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg px-5 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200'
            onClick={() => setOpen(true)}
          />
        </div>

        <div className='bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <TableHeader />
              <tbody>
                {teamList.length > 0 ? (
                  teamList.map((user, index) => (
                    <TableRow key={user?._id || index} user={user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No team members found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={(v) => { 
          setOpen(v); 
          if (!v) {
            setSelected(null);
            refetch();
          }
        }}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
        msg="Are you sure you want to delete this user?"
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
        message={`Are you sure you want to ${selected?.isActive ? 'deactivate' : 'activate'} this user?`}
      />
    </>
  );
};

export default Users;