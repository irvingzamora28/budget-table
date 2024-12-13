import React, { useState } from "react";
import { 
    FaChevronRight, 
    FaChevronDown, 
    FaPlus, 
    FaTrash, 
    FaTimes 
} from 'react-icons/fa';
import CategoryService from "../services/CategoryService";

const CategoryModal = ({ showModal, setShowModal, category, onSave, onAddConceptToCategory }) => {
    const [categoryTitle, setCategoryTitle] = useState(category.title);
    const [conceptName, setConceptName] = useState("");
    const [concepts, setConcepts] = useState(category.concepts || []);
    const [expandedConcepts, setExpandedConcepts] = useState({});
    const [activeSubconceptInput, setActiveSubconceptInput] = useState(null);

    const toggleConceptExpansion = (conceptId) => {
        setExpandedConcepts(prev => ({
            ...prev,
            [conceptId]: !prev[conceptId]
        }));
    };

    const handleAddConcept = async () => {
        if (conceptName.trim() === "") return;
        try {
            const { newConcept, newBudget } = await CategoryService.addConceptToCategory(category.id, conceptName, category.type);
            const conceptWithDetails = { 
                ...newConcept, 
                budget: newBudget,
                subconcepts: [] 
            };
            setConcepts([...concepts, conceptWithDetails]);
            setConceptName("");
            onAddConceptToCategory(newConcept, newBudget);
        } catch (error) {
            console.error("Error adding concept:", error);
        }
    };

    const handleAddSubconcept = async (conceptId, subconceptName) => {
        if (subconceptName.trim() === "") return;
        try {
            const updatedConcept = await CategoryService.addSubconceptToConcept(conceptId, subconceptName);
            setConcepts(concepts.map(concept => 
                concept.id === conceptId ? updatedConcept : concept
            ));
            // Reset active input and ensure concept is expanded
            setActiveSubconceptInput(null);
            setExpandedConcepts(prev => ({
                ...prev,
                [conceptId]: true
            }));
        } catch (error) {
            console.error("Error adding subconcept:", error);
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

    const handleDeleteSubconcept = async (conceptId, subconceptId) => {
        try {
            const updatedConcept = await CategoryService.deleteSubconceptFromConcept(conceptId, subconceptId);
            setConcepts(concepts.map(concept => 
                concept.id === conceptId ? updatedConcept : concept
            ));
        } catch (error) {
            console.error("Error deleting subconcept:", error);
        }
    };

    const handleSave = () => {
        onSave(categoryTitle);
        setShowModal(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit Category</h2>
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 overflow-y-auto flex-grow">
                    {/* Category Title Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Title
                        </label>
                        <input
                            type="text"
                            value={categoryTitle}
                            onChange={(e) => setCategoryTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Concepts Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Concepts
                        </h3>

                        {/* Concept Addition */}
                        <div className="flex mb-4">
                            <input
                                type="text"
                                value={conceptName}
                                onChange={(e) => setConceptName(e.target.value)}
                                placeholder="Add new concept"
                                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddConcept()}
                            />
                            <button
                                onClick={handleAddConcept}
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition flex items-center"
                            >
                                <FaPlus className="h-5 w-5 mr-1" /> Concept
                            </button>
                        </div>

                        {/* Concept List */}
                        {concepts.length === 0 ? (
                            <p className="text-gray-500 italic text-center">
                                No concepts added yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {concepts.map(concept => (
                                    <div 
                                        key={concept.id} 
                                        className="border rounded-md overflow-hidden"
                                    >
                                        {/* Concept Header */}
                                        <div className="bg-gray-50 p-3 flex justify-between items-center">
                                            <div 
                                                className="flex items-center cursor-pointer flex-grow"
                                                onClick={() => toggleConceptExpansion(concept.id)}
                                            >
                                                {concept.subconcepts && concept.subconcepts.length > 0 ? (
                                                    expandedConcepts[concept.id] ? (
                                                        <FaChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                                                    ) : (
                                                        <FaChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                                                    )
                                                ) : (
                                                    <div className="w-6"></div>
                                                )}
                                                <span className="font-semibold">{concept.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setActiveSubconceptInput(
                                                        activeSubconceptInput === concept.id ? null : concept.id
                                                    )}
                                                    className="text-green-500 hover:text-green-700 p-1"
                                                    title="Add Subconcept"
                                                >
                                                    <FaPlus className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteConcept(concept.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete Concept"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subconcept Section */}
                                        {(concept.subconcepts && concept.subconcepts.length > 0 || 
                                          activeSubconceptInput === concept.id) && (
                                            <div 
                                                className={`${
                                                    expandedConcepts[concept.id] || 
                                                    activeSubconceptInput === concept.id 
                                                    ? 'block' : 'hidden'
                                                } p-3 bg-white`}
                                            >
                                                {/* Subconcept List */}
                                                {concept.subconcepts && concept.subconcepts.map(subconcept => (
                                                    <div 
                                                        key={subconcept.id} 
                                                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                                                    >
                                                        <span className="text-sm">{subconcept.name}</span>
                                                        <button
                                                            onClick={() => handleDeleteSubconcept(concept.id, subconcept.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Delete Subconcept"
                                                        >
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Subconcept Addition */}
                                                {activeSubconceptInput === concept.id && (
                                                    <div className="flex mt-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add subconcept"
                                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleAddSubconcept(concept.id, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                if (e.target.value.trim()) {
                                                                    handleAddSubconcept(concept.id, e.target.value);
                                                                }
                                                                setActiveSubconceptInput(null);
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                const input = e.target.previousSibling;
                                                                handleAddSubconcept(concept.id, input.value);
                                                                input.value = '';
                                                            }}
                                                            className="bg-green-500 text-white px-3 py-2 text-sm rounded-r-md hover:bg-green-600 transition flex items-center"
                                                        >
                                                            <FaPlus className="h-4 w-4 mr-1" /> Add
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={() => setShowModal(false)}
                        className="mr-3 px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;