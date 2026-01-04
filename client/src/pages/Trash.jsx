import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
  MdDelete,
} from "react-icons/md";
import clsx from "clsx";
import { toast } from "sonner";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { useGetAllTaskQuery, useRestoreTaskMutation, useDeleteTaskMutation } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loading";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [restoreTask] = useRestoreTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const deleteRestoreHandler = async () => {
    try {
      let result;

      switch (type) {
        case "delete":
          result = await deleteTask({
            id: selected,
            actionType: "delete",
          }).unwrap();
          break;
        case "restore":
          result = await restoreTask({
            id: selected,
            actionType: "restore",
          }).unwrap();
          break;
        default:
          break;
      }

      toast.success(result?.message || "Operation completed successfully");
      
      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error || "Operation failed");
    }
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore this task?");
    setOpenDialog(true);
  };

  const TableHeader = () => (
    <thead className="bg-gray-50 dark:bg-gray-800/50">
      <tr className="text-left">
        <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Task Title</th>
        <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</th>
        <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Stage</th>
        <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Deleted On</th>
        <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={clsx("w-3 h-3 rounded-full flex-shrink-0", TASK_TYPE[item?.stage])} />
          <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex gap-2 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="capitalize text-sm text-gray-600 dark:text-gray-400">{item?.priority}</span>
        </div>
      </td>

      <td className="py-4 px-4">
        <span className="capitalize text-sm text-gray-600 dark:text-gray-400">{item?.stage}</span>
      </td>

      <td className="py-4 px-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {item?.date ? new Date(item.date).toDateString() : "-"}
        </span>
      </td>

      <td className="py-4 px-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => restoreClick(item._id)}
            className="p-2 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-lg transition-colors group"
            title="Restore task"
          >
            <MdOutlineRestore className="text-xl text-secondary-600 dark:text-secondary-400 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => deleteClick(item._id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
            title="Delete permanently"
          >
            <MdDelete className="text-xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  const tasks = Array.isArray(data) ? data : data?.tasks || [];

  return (
    <>
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-6">
          <Title title="Trash" />
        </div>

        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader />
                <tbody>
                  {tasks.map((tk) => (
                    <TableRow key={tk._id} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <MdDelete className="mx-auto text-6xl text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
                Trash is Empty
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Deleted tasks will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;