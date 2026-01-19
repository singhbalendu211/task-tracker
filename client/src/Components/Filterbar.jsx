import React from 'react';
import { useTaskContext } from '../Context/TaskContext';

function Filterbar() {
    const { handleFilterClick, searchQuery, setSearchQuery } = useTaskContext();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="mt-8 space-y-4 px-4">
            {/* Search Bar */}
            <div className="flex justify-center">
                <input 
                    type="text" 
                    placeholder="Search tasks by title or description..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-0">
                <button
                    className="filter-button bg-blue-500 
                    hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l transition-colors duration-200"
                    onClick={() => handleFilterClick('all')}
                >
                    All
                </button>
                <button
                    className="filter-button bg-blue-500 hover:bg-blue-600
                     text-white font-bold py-2 px-4 transition-colors duration-200"
                    onClick={() => handleFilterClick('completed')}
                >
                    Completed
                </button>
                <button
                    className="filter-button bg-blue-500 hover:bg-blue-600
                     text-white font-bold py-2 px-4 rounded-r transition-colors duration-200"
                    onClick={() => handleFilterClick('todo')}
                >
                    To Do
                </button>
            </div>
        </div>
    );
}

export default Filterbar;