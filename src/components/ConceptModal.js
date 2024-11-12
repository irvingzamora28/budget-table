// ConceptModal.js
import React, { useEffect, useState, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const ConceptModal = ({
    showModal,
    setShowModal,
    handleAddConcept,
    existingConceptData = null,
    isEditing = false,
}) => {
    const [newConceptName, setNewConceptName] = useState("");
    const [subconceptName, setSubconceptName] = useState("");
    const [subconcepts, setSubconcepts] = useState([]);
    const [quantity, setQuantity] = useState("");

    // Refs for the input fields
    const subconceptInputRef = useRef(null);
    const conceptInputRef = useRef(null);

    // Initialize state when editing an existing concept
    useEffect(() => {
        if (isEditing && existingConceptData) {
            setNewConceptName(existingConceptData.concept);
            setSubconcepts(
                existingConceptData.subconcepts
                    ? existingConceptData.subconcepts.map((sub) => sub)
                    : []
            );
        } else {
            // Reset state when adding a new concept
            setNewConceptName("");
            setSubconceptName("");
            setSubconcepts([]);
        }
    }, [isEditing, existingConceptData, showModal]);

    // Handle key presses (Escape) inside the modal
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setShowModal(false); // Close modal if Esc is pressed
        }
    };

    // Add keydown event listener when the modal is open
    useEffect(() => {
        if (showModal) {
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        // Clean up the event listener when modal closes
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal]);

    if (!showModal) return null; // Don't render if the modal is not shown

    const handleAddSubconcept = () => {
        if (subconceptName.trim()) {
            setSubconcepts([...subconcepts, { name: subconceptName.trim() }]);
            setSubconceptName("");
            subconceptInputRef.current.focus(); // Focus back to the input field
        }
    };

    const handleRemoveSubconcept = (index) => {
        setSubconcepts(subconcepts.filter((_, i) => i !== index));
    };

    const handleAddOrUpdateConcept = () => {
        if (newConceptName.trim()) {
            handleAddConcept({
                conceptName: newConceptName.trim(),
                subconcepts,
                isEditing,
                existingConceptData,
                quantity: parseFloat(quantity) || 0,
            });
            // Reset the modal state
            setNewConceptName("");
            setSubconceptName("");
            setQuantity("");
            setSubconcepts([]);
            setShowModal(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
            onClick={() => setShowModal(false)} // Close modal when clicking outside
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 md:w-1/3 z-50"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Modal Header */}
                <h3 className="text-xl font-semibold mb-4">
                    {isEditing ? "Edit Concept" : "Add New Concept"}
                </h3>

                {/* Concept Name Input */}
                <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="conceptName"
                >
                    Concept Name
                </label>
                <input
                    type="text"
                    id="conceptName"
                    value={newConceptName}
                    onChange={(e) => setNewConceptName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter concept name"
                    autoFocus
                    ref={conceptInputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            subconceptInputRef.current.focus();
                        } else if (e.key === "Escape") {
                            setShowModal(false);
                        }
                    }}
                />

                {/* Quantity for All Months */}
                <label
                    className="block text-gray-700 font-medium mr-2 mb-2"
                    htmlFor="quantity"
                >
                    Default value
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-24 mb-4"
                    placeholder="0"
                    min="0"
                />

                {/* Subconcepts Section */}
                <h4 className="text-lg font-medium mb-2">
                    Subconcepts (Optional)
                </h4>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={subconceptName}
                        onChange={(e) => setSubconceptName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter subconcept name"
                        ref={subconceptInputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSubconcept();
                            } else if (e.key === "Escape") {
                                setShowModal(false);
                            }
                        }}
                    />
                    <button
                        onClick={handleAddSubconcept}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-2"
                        disabled={!subconceptName.trim()}
                        title="Add subconcept"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Subconcepts List */}
                {subconcepts.length > 0 && (
                    <table className="w-full table-auto border-collapse mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">
                                    Subconcept Name
                                </th>
                                <th className="border p-2 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subconcepts.map((sub, index) => (
                                <tr key={index} className="border-t">
                                    <td className="border p-2">{sub.name}</td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() =>
                                                handleRemoveSubconcept(index)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove subconcept"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal Actions */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleAddOrUpdateConcept}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                        disabled={!newConceptName.trim()}
                    >
                        {isEditing ? "Save Changes" : "Add Concept"}
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConceptModal;
