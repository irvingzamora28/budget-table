import React, { useEffect, useState, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa"; // Importing icons

const ConceptModal = ({ showModal, setShowModal, handleAddConcept }) => {
    const [newConceptName, setNewConceptName] = useState("");
    const [subconceptName, setSubconceptName] = useState("");
    const [subconcepts, setSubconcepts] = useState([]);

    // Refs for the input fields
    const subconceptInputRef = useRef(null);
    const conceptInputRef = useRef(null);

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
            setSubconcepts([...subconcepts, subconceptName.trim()]);
            setSubconceptName("");
            subconceptInputRef.current.focus(); // Focus back to the input field
        }
    };

    const handleRemoveSubconcept = (index) => {
        setSubconcepts(subconcepts.filter((_, i) => i !== index));
    };

    const handleAddConceptWithSubconcepts = () => {
        if (newConceptName.trim()) {
            handleAddConcept({
                conceptName: newConceptName.trim(),
                subconcepts,
            });
            // Reset the modal state
            setNewConceptName("");
            setSubconceptName("");
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
                <h3 className="text-xl font-semibold mb-4">Add New Concept</h3>
                <input
                    type="text"
                    value={newConceptName}
                    onChange={(e) => setNewConceptName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter concept name"
                    autoFocus
                    ref={conceptInputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // Move focus to the subconcept input
                            subconceptInputRef.current.focus();
                        } else if (e.key === "Escape") {
                            setShowModal(false);
                        }
                    }}
                />

                {/* Subconcepts Section */}
                <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">
                        Subconcepts (Optional)
                    </h4>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={subconceptName}
                            onChange={(e) => setSubconceptName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter subconcept name"
                            ref={subconceptInputRef} // Attach ref here
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
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
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {subconcepts.length > 0 && (
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">
                                        Subconcept Name
                                    </th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subconcepts.map((sub, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="border p-2">{sub}</td>
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() =>
                                                    handleRemoveSubconcept(
                                                        index
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAddConceptWithSubconcepts}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                        disabled={!newConceptName.trim()}
                    >
                        Add Concept
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
