

import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../Context/TaskContext';

function EditModal({ isOpen, closeModal, taskId, initialTitle = '', initialDescription = '', initialStatus = 'todo', task = null }) {
    const { editTask } = useTaskContext();
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [status, setStatus] = useState(initialStatus);
    
    // Use taskId prop, but fallback to task._id or task.id if taskId is undefined
    const actualTaskId = taskId || task?._id || task?.id;

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setDescription(initialDescription);
            setStatus(initialStatus);
        }
    }, [isOpen, initialTitle, initialDescription, initialStatus]);

    const handleSubmit = () => {
        console.log('EditModal - actualTaskId:', actualTaskId, 'taskId prop:', taskId, 'task:', task);
        console.log('Edit data - title:', title, 'description:', description, 'status:', status);
        if (!actualTaskId) {
            console.error('Cannot submit: Task ID is missing', { actualTaskId, taskId, task });
            alert('Unable to edit task. Task ID not found.');
            return;
        }
        console.log('Submitting edit for task:', actualTaskId);
        editTask(actualTaskId, title, description, status);
        closeModal();
    };

    return (
        <div className={`modal ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}
         fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300`}
            style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)' }}>
            <div className={`modal-container bg-white w-full
             md:w-1/3 mx-auto mt-20 p-6 rounded shadow-lg transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <div className="modal-header flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Edit Task</h3>
                    <button 
                        type="button"
                        className="text-gray-500 hover:text-gray-800"
                        onClick={closeModal}>X</button>
                </div>
                <div className="modal-body mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 
                        text-sm font-bold mb-2" htmlFor="title">Title</label>
                        <input className="border rounded w-full py-2
                                          px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline transition-shadow duration-200" 
                               id="title" 
                               type="text" 
                               value={title}
                               onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 
                        text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea className="border rounded w-full py-2
                                          px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline transition-shadow duration-200" 
                               id="description" 
                               value={description}
                               onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 
                        text-sm font-bold mb-2" htmlFor="status">Status</label>
                        <select className="border rounded w-full py-2
                                          px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline transition-shadow duration-200" 
                               id="status" 
                               value={status}
                               onChange={(e) => setStatus(e.target.value)}>
                            <option value="todo">To Do</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            type="button"
                            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200
                        text-white font-bold py-2 px-4 rounded"
                            onClick={handleSubmit}>Save</button>
                        <button 
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 transition-colors duration-200
                                            text-gray-800 font-bold 
                                           py-2 px-4 rounded"
                            onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditModal;