// src/components/TableYear.js
import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'; // Import React-Icons for the button

const TableYear = ({ title, year, initialData }) => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');

  // Months array for table header
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Function to handle value edits
  const handleEdit = (e, rowIndex, month) => {
    const newData = [...data];
    newData[rowIndex][month] = e.target.value;
    setData(newData);
  };

  // Function to append a new concept
  const handleAddConcept = () => {
    const newConcept = { concept: newConceptName, Jan: '', Feb: '', Mar: '', Apr: '', May: '', Jun: '', Jul: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    setData([...data, newConcept]);
    setShowModal(false);
    setNewConceptName(''); // Clear input field after adding
  };

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
  }, [showModal, newConceptName]); // Re-run the effect if modal visibility or concept name changes

  return (
    <section className="bg-white shadow-md rounded-lg p-3 my-6">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <table className="min-w-full table-auto">
        {/* Table Header */}
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{year}</th>
            {months.map((month) => (
              <th key={month} className="px-4 py-2 text-right font-medium">{month}</th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="text-gray-600">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold">{row.concept}</td>
              {months.map((month) => (
                <td key={month} className="px-4 py-3 text-right">
                  <input
                    type="text"
                    value={row[month]}
                    onChange={(e) => handleEdit(e, rowIndex, month)}
                    className="w-full bg-transparent text-right outline-none"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Concept Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        <AiOutlinePlus className="mr-2" /> {/* Add Icon */}
        Add Concept
      </button>

      {/* Modal for Adding Concept Name */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add New Concept</h3>
            <input
              type="text"
              value={newConceptName}
              onChange={(e) => setNewConceptName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter concept name"
              autoFocus // Automatically focus the input
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
      )}
    </section>
  );
};

export default TableYear;
