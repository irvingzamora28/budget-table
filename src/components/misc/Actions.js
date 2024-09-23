import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Actions = ({ item, onUpdate, onDelete }) => {
    return (
        <div>
            <button
                className="text-blue-500 hover:underline mr-4"
                onClick={() => onUpdate(item)}
            >
                <FaEdit />
            </button>
            <button
                className="text-red-500 hover:underline"
                onClick={() => onDelete(item)}
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default Actions;
