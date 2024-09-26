// ConceptRow.js
import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import SubconceptRow from "./SubconceptRow";

const ConceptRow = ({
    conceptData,
    sectionIndex,
    rowIndex,
    months,
    condensed,
    paddingClass,
    onEdit,
    onFocus,
    onBlur,
    editingCell,
    expandedConcepts,
    toggleConceptExpansion,
    currency,
}) => {
    const key = `${sectionIndex}-${rowIndex}`;
    const isExpanded = expandedConcepts[key];

    // Function to calculate total for the concept (excluding subconcepts)
    const calculateTotal = () => {
        return months.reduce((total, month) => {
            const value = parseFloat(conceptData[month]) || 0;
            return total + value;
        }, 0);
    };

    // Calculate total of subconcepts for validation
    const calculateSubconceptsTotalForMonth = (month) => {
        if (conceptData.subconcepts && conceptData.subconcepts.length > 0) {
            return conceptData.subconcepts.reduce((sum, sub) => {
                const value = parseFloat(sub[month]) || 0;
                return sum + value;
            }, 0);
        }
        return 0;
    };

    // Check if any subconcept totals exceed the concept's amount
    const monthExceeds = months.some((month) => {
        const conceptValue = parseFloat(conceptData[month]) || 0;
        const subconceptsTotal = calculateSubconceptsTotalForMonth(month);
        return subconceptsTotal > conceptValue;
    });

    return (
        <>
            {/* Concept Row */}
            <tr
                className={`border-t border-b border-x border-gray-100 hover:bg-gray-${
                    condensed ? "200" : "50"
                }`}
            >
                {/* Concept Name */}
                <td
                    className={`${paddingClass} ${
                        condensed ? "py-1" : "py-2"
                    } font-semibold relative max-w-[200px] cursor-pointer border-x`}
                    onClick={() =>
                        conceptData.subconcepts &&
                        conceptData.subconcepts.length > 0
                            ? toggleConceptExpansion(sectionIndex, rowIndex)
                            : null
                    }
                >
                    <div className="flex items-center">
                        {conceptData.subconcepts &&
                            conceptData.subconcepts.length > 0 && (
                                <span className="mr-2">
                                    {isExpanded ? (
                                        <FaChevronDown />
                                    ) : (
                                        <FaChevronRight />
                                    )}
                                </span>
                            )}
                        {conceptData.concept}
                    </div>
                </td>

                {/* Month Cells */}
                {months.map((month) => {
                    const cellKey = `${key}-${month}`;
                    const conceptValue = parseFloat(conceptData[month]) || 0;
                    const subconceptsTotal =
                        calculateSubconceptsTotalForMonth(month);
                    const exceeds = subconceptsTotal > conceptValue;

                    const isEditing = editingCell === cellKey;

                    // Display an empty string if the value is zero and not being edited
                    const displayValue = isEditing
                        ? conceptData[month]
                        : conceptValue === 0
                        ? ""
                        : conceptValue.toLocaleString("en-US", {
                              style: "currency",
                              currency: currency === "€" ? "EUR" : "USD",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                          });

                    return (
                        <td
                            key={cellKey}
                            className={`${paddingClass} ${
                                condensed ? "py-1" : "py-2"
                            } text-right border-x ${
                                exceeds ? "bg-red-100" : ""
                            }`}
                            title={
                                exceeds
                                    ? "Subconcepts total exceeds concept amount"
                                    : ""
                            }
                        >
                            <input
                                type="text"
                                value={displayValue}
                                onChange={(e) =>
                                    onEdit(e, sectionIndex, rowIndex, month)
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

            {/* Subconcept Rows */}
            {isExpanded &&
                conceptData.subconcepts &&
                conceptData.subconcepts.map((sub, subIndex) => (
                    <SubconceptRow
                        key={`${key}-sub-${subIndex}`}
                        subData={sub}
                        sectionIndex={sectionIndex}
                        rowIndex={rowIndex}
                        subIndex={subIndex}
                        months={months}
                        condensed={condensed}
                        paddingClass={paddingClass}
                        onEdit={onEdit}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        editingCell={editingCell}
                        currency={currency}
                    />
                ))}
        </>
    );
};

export default ConceptRow;
