import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

// Sample statuses, for example purposes.
const statuses = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    OFFLINE: "OFFLINE",
};

const CrudComponent = ({ title, items, onCreate, onUpdate, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Search functionality to filter items based on the search query
    useEffect(() => {
        const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchQuery, items]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            onDelete(id);
        }
    };

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="relative">
                        <select
                            className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                            onChange={(e) =>
                                setItemsPerPage(parseInt(e.target.value))
                            }
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
                    {/* Create Button */}
                    <button
                        onClick={onCreate}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create New
                    </button>
                </div>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-50 text-gray-600">
                        <th className="text-left py-3 px-6 font-medium">Name</th>
                        <th className="text-left py-3 px-6 font-medium">
                            Description
                        </th>
                        <th className="text-left py-3 px-6 font-medium">Status</th>
                        <th className="text-left py-3 px-6 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b hover:bg-gray-100"
                        >
                            <td className="py-4 px-6 flex items-center">
                                <img
                                    className="w-10 h-10 rounded-full mr-3"
                                    src="https://via.placeholder.com/150"
                                    alt={item.name}
                                />
                                <div>{item.name}</div>
                            </td>
                            <td className="py-4 px-6">{item.description}</td>
                            <td className="py-4 px-6">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === statuses.ACTIVE
                                            ? "bg-green-100 text-green-700"
                                            : item.status === statuses.INACTIVE
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button
                                    className="text-blue-600 hover:underline mr-4"
                                    onClick={() => onUpdate(item.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex">
                    <button
                        className="px-3 py-2 bg-gray-100 border-r rounded-bl-md rounded-tl-md border-gray-300 hover:bg-gray-200"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        <FaAngleDoubleLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                        className="px-3 py-2 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
                        onClick={() => handlePageChange("prev")}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                        className="px-3 py-2 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
                        onClick={() => handlePageChange("next")}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-br-md rounded-tr-md border-gray-300"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <FaAngleDoubleRight className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrudComponent;
