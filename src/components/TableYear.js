import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'; // Import React-Icons for the button
import ConceptModal from './ConceptModal';

const TableYear = ({ title, year, initialData, condensed = false, onMonthClick }) => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const conceptRefs = useRef([]);
  const tdRefs = useRef([]);

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

  const handleMonthClick = (month) => {
    if (onMonthClick) {
      onMonthClick(month);
    }
  };

  const paddingClass = condensed ? 'px-2' : 'px-4';
  const paddingClassTitle = condensed ? 'px-4' : 'px-6';

  return (
    <section className={`bg-white shadow-md ${condensed ? 'rounded-none p-0' : 'rounded-lg p-3'} ${condensed ? 'my-0' : 'my-6'}`}>
      <h2 className={`${condensed ? 'text-lg' : 'text-2xl'} font-semibold ${condensed ? 'mb-0' : 'mb-3'} ${condensed ? 'bg-orange-200' : ''} ${paddingClassTitle}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700">
            <tr className={`border-t border-b border-x`}>
              <th className={`${paddingClassTitle} ${condensed ? 'py-1' : 'py-2'} px-4 text-left font-medium`}>{year}</th>
              {months.map((month) => (
                <th 
                  key={month} 
                  className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} text-right font-medium cursor-pointer hover:bg-gray-100`}
                  onClick={() => handleMonthClick(month)}
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`border-t border-b border-x border-gray-100 hover:bg-gray-${condensed ? '200' : '50'}`}>
                <td
                  ref={el => tdRefs.current[rowIndex] = el}
                  className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} font-semibold relative max-w-[200px] cursor-default border-x`}
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
                  <td key={month} className={`${paddingClass} ${condensed ? 'py-1' : 'py-2'} text-right border-x`}>
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

      {/* Button to open modal */}
      {!condensed && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <AiOutlinePlus className="mr-2" />
          Add Concept
        </button>
      )}

      {/* Use the reusable Modal component */}
      <ConceptModal
        showModal={showModal}
        setShowModal={setShowModal}
        newConceptName={newConceptName}
        setNewConceptName={setNewConceptName}
        handleAddConcept={handleAddConcept}
      />

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
