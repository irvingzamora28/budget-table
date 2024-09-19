import React, { useEffect } from 'react';

const ConceptModal = ({ showModal, setShowModal, newConceptName, setNewConceptName, handleAddConcept }) => {
  // Handle key presses (Enter and Esc) inside the modal
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newConceptName.trim()) {
      handleAddConcept(); // Add concept if Enter is pressed
    } else if (e.key === 'Escape') {
      setShowModal(false); // Close modal if Esc is pressed
    }
  };

  // Add keydown event listener when the modal is open
  useEffect(() => {
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when modal closes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, newConceptName]);

  if (!showModal) return null; // Don't render if the modal is not shown

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50">
        <h3 className="text-xl font-semibold mb-4">Add New Concept</h3>
        <input
          type="text"
          value={newConceptName}
          onChange={(e) => setNewConceptName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Enter concept name"
          autoFocus
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddConcept}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
            disabled={!newConceptName.trim()}
          >
            Add
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
