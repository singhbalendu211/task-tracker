import React, { useState } from "react";
import { useTaskContext } from "../Context/TaskContext";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditModal";

function TaskList() {
  const { filteredTasks, updateTaskStatus } = useTaskContext();
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDelete = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleEdit = (taskId, title, description, status) => {
    setTaskToEdit({ _id: taskId, id: taskId, title, description, status });
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleComplete = (taskId) => {
    updateTaskStatus(taskId, "completed");
    setOpenDropdownId(null);
  };

  const toggleDropdown = (taskId) =>
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);

  const isDropdownOpen = (taskId) => openDropdownId === taskId;

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-yellow-200";
      case "completed":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="my-8 px-4">
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg font-semibold">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">Create a new task to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredTasks.map((task, index) => (
            <div 
              key={task._id || index}
              className={`relative rounded-md shadow-md cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-105 ${getStatusColor(task.status)}`}
            >
              <div className="p-4" onClick={() => setOpenDropdownId(null)}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(task._id || task.id);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
              </div>

              {isDropdownOpen(task._id || task.id) && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <button
                    type="button"
                    className="block w-full py-2 px-4 text-left hover:bg-gray-100 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task._id || task.id, task.title, task.description, task.status);
                      setOpenDropdownId(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="block w-full py-2 px-4 text-left text-red-600 hover:bg-red-100 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id || task.id);
                      setOpenDropdownId(null);
                    }}
                  >
                    Delete
                  </button>
                  {task.status !== "completed" && (
                    <button
                      type="button"
                      className="block w-full py-2 px-4 text-left hover:bg-gray-100 transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete(task._id || task.id);
                        setOpenDropdownId(null);
                      }}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        taskId={taskToDelete}
        task={{ _id: taskToDelete, id: taskToDelete }}
      />

      <EditModal
        isOpen={isEditModalOpen}
        closeModal={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        taskId={taskToEdit?.id}
        initialTitle={taskToEdit?.title}
        initialDescription={taskToEdit?.description}
        initialStatus={taskToEdit?.status}
        task={taskToEdit}
      />
    </div>
  );
}

export default TaskList;
