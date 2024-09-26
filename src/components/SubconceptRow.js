// SubconceptRow.js
import React from "react";

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
                className={`${paddingClass} ${
                    condensed ? "py-0" : "py-2"
                } relative max-w-[200px] border-x`}
            >
                <div className="pl-6">{subData.concept}</div>
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
