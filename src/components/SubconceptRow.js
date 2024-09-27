import React, { useState, useEffect, useRef } from "react";

const SubconceptRow = ({
    subData,
    sectionIndex,
    rowIndex,
    subIndex,
    months,
    condensed,
    paddingClass,
    onEdit,
    onFocus,
    onBlur,
    editingCell,
    currency,
}) => {
    const key = `${sectionIndex}-${rowIndex}-sub-${subIndex}`;

    // State and refs for scrolling text
    const [isHovered, setIsHovered] = useState(false);
    const conceptRef = useRef(null);
    const tdRef = useRef(null);

    useEffect(() => {
        if (conceptRef.current && tdRef.current) {
            const tdWidth = tdRef.current.clientWidth;
            const textWidth = conceptRef.current.scrollWidth;

            if (isHovered && textWidth > tdWidth) {
                const animationDuration = textWidth / 50;
                conceptRef.current.style.animation = `scrollText ${animationDuration}s linear infinite`;
            } else {
                conceptRef.current.style.animation = "none";
            }
        }
    }, [isHovered]);

    // Function to calculate total
    const calculateTotal = () => {
        return months.reduce((total, month) => {
            const value = parseFloat(subData[month]) || 0;
            return total + value;
        }, 0);
    };

    return (
        <tr
            className={`border-t border-b border-x border-gray-100 hover:bg-gray-${
                condensed ? "200" : "50"
            }`}
        >
            {/* Subconcept Name */}
            <td
                ref={tdRef}
                className={`${paddingClass} ${
                    condensed ? "py-0" : "py-2"
                } relative max-w-[200px] border-x`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="concept-text-container">
                    <div
                        ref={conceptRef}
                        className="pl-6 whitespace-nowrap inline-block px-2"
                    >
                        {subData.concept}
                    </div>
                </div>
            </td>

            {/* Month Cells */}
            {months.map((month) => {
                const cellKey = `${key}-${month}`;
                const subValue = parseFloat(subData[month]) || 0;
                const isEditing = editingCell === cellKey;

                // Display an empty string if the value is zero and not being edited
                const displayValue = isEditing
                    ? subData[month]
                    : subValue === 0
                    ? ""
                    : subValue.toLocaleString("en-US", {
                          style: "currency",
                          currency: currency === "€" ? "EUR" : "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      });

                return (
                    <td
                        key={cellKey}
                        className={`${paddingClass} ${
                            condensed ? "py-0" : "py-2"
                        } text-right border-x`}
                    >
                        <input
                            type="text"
                            value={displayValue}
                            onChange={(e) =>
                                onEdit(
                                    e,
                                    sectionIndex,
                                    rowIndex,
                                    month,
                                    true,
                                    subIndex
                                )
                            }
                            onFocus={() => onFocus(cellKey)}
                            onBlur={onBlur}
                            className={`w-full bg-transparent text-right outline-none ${
                                condensed ? "text-sm" : ""
                            }`}
                        />
                    </td>
                );
            })}

            {/* Total Cell */}
            <td className={`${paddingClass} text-right font-semibold`}>
                {calculateTotal() === 0
                    ? ""
                    : calculateTotal().toLocaleString("en-US", {
                          style: "currency",
                          currency: currency === "€" ? "EUR" : "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      })}
            </td>
        </tr>
    );
};

export default SubconceptRow;
