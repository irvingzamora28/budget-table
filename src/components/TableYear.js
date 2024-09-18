import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'; // Import React-Icons for the button

const TableYear = ({ title, year, initialData, condensed = false }) => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const conceptRefs = useRef([]);
  const tdRefs = useRef([]);
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


  useEffect(() => {
    conceptRefs.current.forEach((el, index) => {
      if (el && tdRefs.current[index]) {
        const tdWidth = tdRefs.current[index].clientWidth;
        const textWidth = el.scrollWidth;

        if (index === hoveredIndex && textWidth > tdWidth) {
          const animationDuration = textWidth / 50; // Adjust for desired speed
          el.style.animation = `scrollText ${animationDuration}s linear infinite`;
        } else {
          el.style.animation = 'none';
        }
      }
    });
  }, [hoveredIndex]);

  const paddingClass = condensed ? 'px-2' : 'px-4';
  const paddingClassTitle = condensed ? 'px-4' : 'px-6';

  return (
    <section className={`bg-white shadow-md ${condensed ? 'rounded-none p-0' : 'rounded-lg p-3'} ${condensed ? 'my-0' : 'my-6'}`}>
      <h2 className={`${condensed ? 'text-lg' : 'text-2xl'} font-semibold ${condensed ? 'mb-0' : 'mb-3'} ${condensed ? 'bg-orange-200' : ''} ${paddingClassTitle}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className={`${paddingClassTitle} ${condensed ? 'py-1' : 'py-2'} px-4 text-left font-medium`}>{year}</th>
              {months.map((month) => (
                <th key={month} className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} text-right font-medium`}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`border-t border-gray-100 hover:bg-gray-${condensed ? '200' : '50'}`}>
                <td
                  ref={el => tdRefs.current[rowIndex] = el}
                  className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} font-semibold relative max-w-[200px] cursor-default`}
                  onMouseEnter={() => setHoveredIndex(rowIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="concept-text-container">
                    <div
                      ref={el => conceptRefs.current[rowIndex] = el}
                      className="concept-text whitespace-nowrap inline-block px-2"
                    >
                      {row.concept}
                    </div>
                  </div>
                </td>
                {months.map((month) => (
                  <td key={month} className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} text-right`}>
                    <input
                      type="text"
                      value={row[month]}
                      onChange={(e) => handleEdit(e, rowIndex, month)}
                      className={`w-full bg-transparent text-right outline-none ${condensed ? 'text-sm' : ''}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!condensed && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <AiOutlinePlus className="mr-2" />
          Add Concept
        </button>
      )}

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
      )}

      <style>{`
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% + 200px)); }
        }
        .concept-text-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
        }
      `}</style>
    </section>
  );
};

export default TableYear;