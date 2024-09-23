import React from "react";
import { FaPlus } from "react-icons/fa";

const SearchBar = ({
    searchQuery,
    onSearch,
    itemsPerPage,
    onItemsPerPageChange,
    onCreate,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <input
                type="text"
                className="w-full md:w-auto border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={onSearch}
            />
            <div className="flex space-x-2 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                    <select
                        className="block w-full md:w-auto px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                        onChange={onItemsPerPageChange}
                        value={itemsPerPage}
                    >
                        <option value={5}>Show 5</option>
                        <option value={10}>Show 10</option>
                        <option value={20}>Show 20</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
                <button
                    onClick={onCreate}
                    className="flex items-center w-full md:w-auto justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create New <FaPlus className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
