import React from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from "react-icons/fa";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex">
            <button
                className="px-3 py-2 bg-gray-100 border-r rounded-bl-md rounded-tl-md border-gray-300 hover:bg-gray-200"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <FaAngleDoubleLeft className="h-4 w-4 text-gray-500" />
            </button>
            <button
                className="px-3 py-2 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FaChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <button
                className="px-3 py-2 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FaChevronRight className="h-4 w-4 text-gray-500" />
            </button>
            <button
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-br-md rounded-tr-md border-gray-300"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <FaAngleDoubleRight className="h-4 w-4 text-gray-500" />
            </button>
        </div>
    );
};

export default PaginationControls;
