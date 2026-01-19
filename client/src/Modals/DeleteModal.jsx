

import React from 'react';
import { useTaskContext } from '../Context/TaskContext';

function DeleteModal({ isOpen, closeModal, taskId, task = null }) {
    const { deleteTask } = useTaskContext();
    
    // Use taskId prop, but fallback to task._id or task.id if taskId is undefined
    const actualTaskId = taskId || task?._id || task?.id;

    const handleDelete = () => {
        console.log('DeleteModal - actualTaskId:', actualTaskId, 'taskId prop:', taskId, 'task:', task);
        if (!actualTaskId) {
            console.error('Task ID is missing', { actualTaskId, taskId, task });
            alert('Unable to delete task. Task ID not found.');
            return;
        }
        console.log('Deleting task:', actualTaskId);
        deleteTask(actualTaskId);
        closeModal();
    };

    return (
        <div className={`modal ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}
         fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300`}
            style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)' }}>
            <div className={`modal-container bg-white w-full
             md:w-1/3 mx-auto mt-20 p-6 rounded shadow-lg transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <div className="modal-header flex justify-between
                 items-center">
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <button 
                        type="button"
                        className="text-gray-500 hover:text-gray-800"
                        onClick={closeModal}>X</button>
                </div>
                <div className="modal-body mt-4">
                    <p>Are you sure you want to delete this task?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            type="button"
                            className="bg-red-500 hover:bg-red-600 transition-colors duration-200
                         text-white font-bold py-2 px-4 rounded"
                            onClick={handleDelete}>Delete</button>
                        <button 
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 transition-colors duration-200
                         text-gray-800 font-bold py-2 px-4 rounded"
                            onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;