// Section.js
import React from "react";
import ConceptRow from "./ConceptRow";
import SectionTotalRow from "./SectionTotalRow";
import AddConceptRow from "./AddConceptRow";

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
    return (
        <>
            {/* Section Title */}
            <tr className="bg-orange-200 border-x border-y-orange-200">
                <td
                    // colSpan={months.length + 2}
                    className={`${paddingClassTitle} py-0 font-semibold text-slate-700 sticky left-0 text-nowrap`}
                >
                    {sectionData.title} sdf
                </td>
                {/* Render one column for each month using months.length columns */}
                {[...Array(months.length+1)].map((_, i) => <td key={i}></td>)}

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

            {/* Add Concept Row */}
            <AddConceptRow
                sectionIndex={sectionIndex}
                months={months}
                condensed={condensed}
                paddingClass={paddingClass}
                onAddConcept={onAddConcept}
            />
        </>
    );
};

export default Section;
