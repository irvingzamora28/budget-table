import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Actions = ({ itemId, onUpdate, onDelete }) => {
    return (
        <div>
            <button
                className="text-blue-500 hover:underline mr-4"
                onClick={() => onUpdate(itemId)}
            >
                <FaEdit />
            </button>
            <button
                className="text-red-500 hover:underline"
                onClick={() => onDelete(itemId)}
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default Actions;
