import React, { useEffect, useState } from "react";
import CategoryService from "../services/CategoryService";

const CategoryModal = ({ showModal, setShowModal, category, onSave }) => {
    const [categoryTitle, setCategoryTitle] = useState(category.title);
    const [conceptName, setConceptName] = useState("");
    const [concepts, setConcepts] = useState(category.concepts || []);

    useEffect(() => {
        console.log("CategoryModal mounted");
        console.log("category", category);
        
    }, []);
        

    const handleTitleChange = (e) => {
        setCategoryTitle(e.target.value);
    };

    const handleConceptNameChange = (e) => {
        setConceptName(e.target.value);
    };

    const handleSave = () => {
        onSave(categoryTitle);
        setShowModal(false);
    };

    const handleAddConcept = async () => {
        if (conceptName.trim() === "") return;
        try {
            const { newConcept, newBudget } = await CategoryService.addConceptToCategory(category.id, conceptName, category.type);
            setConcepts([...concepts, { ...newConcept, budget: newBudget }]);
            setConceptName("");
        } catch (error) {
            console.error("Error adding concept:", error);
        }
    };

    const handleDeleteConcept = async (conceptId) => {
        try {
            await CategoryService.deleteConceptFromCategory(conceptId);
            setConcepts(concepts.filter(concept => concept.id !== conceptId));
        } catch (error) {
            console.error("Error deleting concept:", error);
        }
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
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">Concepts</h3>
                    <ul className="mb-4">
                        {concepts.map(concept => (
                            <li key={concept.id} className="flex justify-between items-center mb-2">
                                <span>{concept.name}</span>
                                <button
                                    onClick={() => handleDeleteConcept(concept.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex mb-4">
                        <input
                            type="text"
                            value={conceptName}
                            onChange={handleConceptNameChange}
                            className="w-full p-2 border border-gray-300 rounded mr-2"
                            placeholder="New concept name"
                        />
                        <button
                            onClick={handleAddConcept}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex justify-end">
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