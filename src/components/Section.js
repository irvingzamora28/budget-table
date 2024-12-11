import React, { useState, useEffect, useRef } from "react";
import ConceptRow from "./ConceptRow";
import SectionTotalRow from "./SectionTotalRow";
import AddConceptRow from "./AddConceptRow";
import { FaPencilAlt } from "react-icons/fa";

const Section = ({
    sectionData,
    sectionIndex,
    months,
    condensed,
    paddingClass,
    paddingClassTitle,
    onEdit,
    onFocus,
    onBlur,
    editingCell,
    onAddConcept,
    onEditConcept,
    expandedConcepts,
    toggleConceptExpansion,
    currency,
}) => {
    // State and refs for scrolling text
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef(null);
    const outerContainerRef = useRef(null);

    useEffect(() => {
        if (sectionRef.current && outerContainerRef.current) {
            const mainTextContainer = outerContainerRef.current;

            // Get max width of the outer container
            const computedStyle = window.getComputedStyle(mainTextContainer);
            const maxWidth =
                parseFloat(computedStyle.getPropertyValue("max-width")) ||
                mainTextContainer.clientWidth;

            const previousWidth = sectionRef.current.style.width;
            sectionRef.current.style.width = "auto";
            sectionRef.current.style.overflow = "visible";

            const textWidth = sectionRef.current.scrollWidth;

            sectionRef.current.style.width = previousWidth;
            sectionRef.current.style.overflow = "hidden";

            sectionRef.current.parentElement.style.width = "90%";

            // Adjust animation only if text overflows
            if (isHovered && textWidth > maxWidth) {
                const scrollDistance = textWidth + maxWidth;
                const animationDuration = scrollDistance / 100; // Adjust speed as needed

                sectionRef.current.style.animation = `scrollText ${animationDuration}s linear infinite`;
            } else {
                sectionRef.current.parentElement.style.width = "100%";
                sectionRef.current.style.animation = "none";
            }
        }
    }, [isHovered, sectionData.title]);

    return (
        <>
            {/* Section Title */}
            <tr className="bg-orange-200 border-x border-y-orange-200 h-7">
                <td
                    className={`section-title-td ${paddingClassTitle} py-0 font-semibold text-slate-700 max-w-60 sticky left-0 flex items-center`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={outerContainerRef} // Outer container for correct reference
                >
                    {/* Outer wrapper for scrolling logic */}
                    <div className="section-text-wrapper flex items-center" style={{ width: "100%", overflow: "hidden" }}>
                        {/* Inner text container for scrolling */}
                        <div
                            ref={sectionRef}
                            className="section-text pl-2 flex items-center whitespace-nowrap"
                            style={{ overflow: "hidden", flexShrink: 0 }}
                        >
                            {sectionData.title}
                        </div>
                    </div>

                    {/* Icon Container */}
                    <div
                        className="section-title-icon-container py-4 px-2"
                        style={{ flexBasis: "20%", textAlign: "right" }}
                    >
                        <FaPencilAlt
                            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            title="Edit Category"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                // Add your edit category logic here
                            }}
                        />
                    </div>
                </td>
                {/* Render one column for each month using months.length columns */}
                {[...Array(months.length + 1)].map((_, i) => (
                    <td key={i}></td>
                ))}
            </tr>

            {/* Concepts */}
            {sectionData.data.map((concept, rowIndex) => (
                <ConceptRow
                    key={`${sectionIndex}-${rowIndex}`}
                    conceptData={concept}
                    sectionIndex={sectionIndex}
                    rowIndex={rowIndex}
                    months={months}
                    condensed={condensed}
                    paddingClass={paddingClass}
                    onEdit={onEdit}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    editingCell={editingCell}
                    onEditConcept={onEditConcept}
                    expandedConcepts={expandedConcepts}
                    toggleConceptExpansion={toggleConceptExpansion}
                    currency={currency}
                />
            ))}

            {/* Section Total Row */}
            <SectionTotalRow
                sectionData={sectionData}
                sectionIndex={sectionIndex}
                months={months}
                condensed={condensed}
                paddingClass={paddingClass}
                paddingClassTitle={paddingClassTitle}
                currency={currency}
            />

            {/* CSS Styles */}
            <style>{`
                .section-text-wrapper {
                    position: relative;
                    overflow: hidden;
                    mask-image: linear-gradient(
                        to right,
                        transparent,
                        black 8px,
                        black calc(100% - 8px),
                        transparent
                    );
                }

                td.section-title-td:hover .section-title-icon-container {
                    opacity: 1; /* Show the pencil icon when hovering */
                    pointer-events: auto; /* Allow interaction */
                }

                .section-text-wrapper:hover .section-text {
                    animation: scrollText 8s linear infinite;
                    overflow: visible !important;
                }

                .section-title-icon-container {
                    flex-shrink: 0;
                    position: absolute;
                    right: 0;
                    opacity: 0; /* Hide by default */
                    transition: opacity 0.3s ease; /* Smooth transition */
                    pointer-events: none; /* Prevent interaction when hidden */
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

export default Section;
