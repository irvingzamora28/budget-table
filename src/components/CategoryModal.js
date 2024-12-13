
import React, { useState } from "react";

const CategoryModal = ({ showModal, setShowModal, category, onSave }) => {
    const [categoryTitle, setCategoryTitle] = useState(category.title);

    const handleTitleChange = (e) => {
        setCategoryTitle(e.target.value);
    };

    const handleSave = () => {
        onSave(categoryTitle);
        setShowModal(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded shadow-lg w-1/3">
                <div className="flex justify-end p-2">
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                    <input
                        type="text"
                        value={categoryTitle}
                        onChange={handleTitleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;