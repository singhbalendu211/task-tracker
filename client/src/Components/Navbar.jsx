
import React, { useState } from 'react';
import { useTaskContext } from '../Context/TaskContext';
import AddTaskModal from '../Modals/AddTaskModal';

function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { tasks, completedTasks, clearCompletedTasks } = useTaskContext();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClearCompleted = () => {
        if (completedTasks > 0 && window.confirm(`Delete ${completedTasks} completed task(s)?`)) {
            clearCompletedTasks();
        }
    };

    return (
        <nav className="bg-gray-800 py-3 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
                {/* Left: Title */}
                <div>
                    <span className="text-white text-lg font-bold">Task Manager</span>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center gap-2">
                    {completedTasks > 0 && (
                        <button 
                            onClick={handleClearCompleted}
                            className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white text-sm font-semibold py-2 px-3 rounded"
                            title={`Delete ${completedTasks} completed task(s)`}
                        >
                            🗑️ Clear ({completedTasks})
                        </button>
                    )}
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded"
                        onClick={openModal}
                    >
                        + Add
                    </button>
                </div>
            </div>
            <AddTaskModal isOpen={isModalOpen} closeModal={closeModal} />
        </nav>
    );
}

export default Navbar;