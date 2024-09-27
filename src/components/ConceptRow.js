import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronRight, FaPencilAlt } from "react-icons/fa";
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
    onEditConcept,
}) => {
    const key = `${sectionIndex}-${rowIndex}`;
    const isExpanded = expandedConcepts[key];

    // State and refs for scrolling text
    const [isHovered, setIsHovered] = useState(false);
    const conceptRef = useRef(null);
    const tdRef = useRef(null);

    useEffect(() => {
        if (conceptRef.current && tdRef.current) {
            // Get parent containers
            const mainTextContainer =
                conceptRef.current.parentElement.parentElement;

            // Get the computed max-width of the main container
            const computedStyle = window.getComputedStyle(mainTextContainer);
            const maxWidth = parseFloat(
                computedStyle.getPropertyValue("max-width")
            );

            // Temporarily remove flex-basis constraint to calculate full text width
            const previousFlexBasis = conceptRef.current.style.flexBasis;
            const previousWidth = conceptRef.current.style.width;

            conceptRef.current.style.flexBasis = "auto";
            conceptRef.current.style.width = "auto";
            conceptRef.current.style.overflow = "visible";

            // Get the widths
            const textWidth = conceptRef.current.scrollWidth;

            // Restore the original flex-basis and width
            conceptRef.current.style.flexBasis = previousFlexBasis;
            conceptRef.current.style.width = previousWidth;
            conceptRef.current.style.overflow = "hidden";


            // If the text overflows the 80% (which is the part of the text in the cell (Icon is the other 20%)), start the animation
            if (isHovered && textWidth > (maxWidth*0.8)) {
                const animationDuration = textWidth / 50;
                conceptRef.current.style.animation = `scrollText ${animationDuration}s linear infinite`;
            } else {
               
                conceptRef.current.style.animation = "none";
            }
        }
    }, [isHovered, conceptData.concept]);

    // Function to calculate total for the concept
    const calculateTotal = () => {
        return months.reduce((total, month) => {
            const value = parseFloat(conceptData[month]) || 0;
            return total + value;
        }, 0);
    };

    // Calculate total of subconcepts for each month
    const calculateSubconceptsTotalForMonth = (month) => {
        if (conceptData.subconcepts && conceptData.subconcepts.length > 0) {
            return conceptData.subconcepts.reduce((sum, sub) => {
                const value = parseFloat(sub[month]) || 0;
                return sum + value;
            }, 0);
        }
        return 0;
    };

    // Determine if the concept has subconcepts
    const hasSubconcepts =
        conceptData.subconcepts && conceptData.subconcepts.length > 0;

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
                    ref={tdRef}
                    className={`${paddingClass} ${
                        condensed ? "py-0" : "py-2"
                    } font-semibold max-w-40 sm:max-w-[200px] cursor-pointer border-x sticky left-0 bg-white hover:bg-gray-${
                        condensed ? "200" : "50"
                    }`}
                    onClick={() =>
                        hasSubconcepts
                            ? toggleConceptExpansion(sectionIndex, rowIndex)
                            : null
                    }
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="concept-text-container flex items-center">
                        {/* Text Container: occupies 80% */}
                        <div
                            ref={conceptRef}
                            className="concept-text pl-2 flex items-center whitespace-nowrap"
                            style={{ flexBasis: "80%", overflow: "hidden" }}
                        >
                            {hasSubconcepts && (
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

                        {/* Icon Container: occupies 20% */}
                        <div
                            className={`icon-container py-4 px-2 bg-gray-${
                                condensed ? "200" : "50"
                            } ${isHovered ? "visible" : "invisible"}`}
                            style={{ flexBasis: "20%", textAlign: "right" }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                onEditConcept(sectionIndex, rowIndex); // Invoke the function
                            }}
                        >
                            <FaPencilAlt
                                className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                title="Edit Concept"
                            />
                        </div>
                    </div>
                </td>

                {/* Month Cells */}
                {months.map((month) => {
                    const cellKey = `${key}-${month}`;
                    let conceptValue = parseFloat(conceptData[month]) || 0;

                    if (hasSubconcepts) {
                        // Calculate the sum of subconcepts
                        conceptValue = calculateSubconceptsTotalForMonth(month);
                    }

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
                                condensed ? "py-0" : "py-2"
                            } text-right border-x ${
                                hasSubconcepts
                                    ? "font-semibold text-blue-600"
                                    : ""
                            }`}
                        >
                            {hasSubconcepts ? (
                                // Display calculated value without input
                                displayValue
                            ) : (
                                // Render input field for concepts without subconcepts
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
                            )}
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
                hasSubconcepts &&
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
                        onEditSubconcept={onEditConcept} // You can handle subconcept editing similarly
                    />
                ))}

            {/* CSS Styles */}
            <style>{`
                .concept-text-container {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    mask-image: linear-gradient(
                        to right,
                        transparent,
                        black 8px,
                        black calc(100% - 8px),
                        transparent
                    );
                }

                .concept-text {
                    white-space: nowrap;
                    transition: transform 0.3s ease;
                    will-change: transform;
                }

                .concept-text-container:hover .concept-text {
                    animation: scrollText 8s linear infinite;
                    overflow: visible !important;
                }

                .icon-container {
                    flex-shrink: 0;
                    position: absolute;
                    right: 0;
                    mask-image: linear-gradient(
                        to right,
                        transparent 0px,
                        black 8px
                    );
                }

                @keyframes scrollText {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-100%));
                    }
                }
            `}</style>
        </>
    );
};

export default ConceptRow;
