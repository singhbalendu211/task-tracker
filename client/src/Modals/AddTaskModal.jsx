
import React, { useState } from 'react';
import { useTaskContext } from '../Context/TaskContext';

function AddTaskModal({ isOpen, closeModal }) {
    const { addTask } = useTaskContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');

    const handleSubmit = () => {
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }
        addTask(title, description, status);
        setTitle('');
        setDescription('');
        setStatus('todo');
        closeModal();
    };

    return (
        <div className={`modal ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}
         fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300`}
            style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)' }}>
            <div className={`modal-container bg-white
             w-full md:w-1/3 mx-auto mt-20 p-6 rounded shadow-lg transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <div className="modal-header flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Add New Task</h3>
                    <button 
                        type="button"
                        className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                        onClick={closeModal}>X</button>
                </div>
                <div className="modal-body mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm
                         font-bold mb-2" htmlFor="title">Title</label>
                        <input className="border rounded w-full py-2
                                           px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline" 
                               id="title" type="text" value={title}
                               onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm
                                           font-bold mb-2" 
                               htmlFor="description">
                             Description
                        </label>
                        <input className="border rounded w-full 
                                          py-2 px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline" 
                               id="description" 
                               type="text"
                               value={description} 
                               onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm
                                           font-bold mb-2" 
                               htmlFor="status">
                             Status
                        </label>
                        <select className="border rounded w-full 
                                          py-2 px-3 text-gray-700 
                                          leading-tight focus:outline-none
                                            focus:shadow-outline" 
                               id="status"
                               value={status}
                               onChange={(e) => setStatus(e.target.value)}>
                            <option value="todo">To Do</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <button 
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200
                                       text-white font-bold 
                                       py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed" 
                            onClick={handleSubmit}
                            disabled={!title.trim()}>
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTaskModal;