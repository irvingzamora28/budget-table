// UnifiedTableYear.js
import React, { useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";

const UnifiedTableYear = ({
    sections,
    year,
    condensed = false,
    onMonthClick,
    showHeader = true,
    currency = "$",
}) => {
    const [data, setData] = useState(sections);
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [expandedConcepts, setExpandedConcepts] = useState({});

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const paddingClass = condensed ? "px-2" : "px-4";
    const paddingClassTitle = condensed ? "px-4" : "px-6";

    // Handle editing of cells
    const handleEdit = (
        e,
        sectionIndex,
        rowIndex,
        month,
        isSubconcept = false,
        subconceptIndex = null
    ) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        if (/^\d*\.?\d*$/.test(value)) {
            const newData = [...data];
            if (isSubconcept) {
                // Update the subconcept value
                newData[sectionIndex].data[rowIndex].subconcepts[
                    subconceptIndex
                ][month] = value;

                // Recalculate the concept's total for the month by summing the subconcepts
                const updatedTotalForMonth = newData[sectionIndex].data[
                    rowIndex
                ].subconcepts.reduce(
                    (total, sub) => total + (parseFloat(sub[month]) || 0),
                    0
                );

                // Update the concept's value with the recalculated total
                newData[sectionIndex].data[rowIndex][month] =
                    updatedTotalForMonth.toFixed(2);
            } else {
                // Check if the concept has subconcepts
                const hasSubconcepts =
                    newData[sectionIndex].data[rowIndex].subconcepts &&
                    newData[sectionIndex].data[rowIndex].subconcepts.length > 0;

                if (!hasSubconcepts) {
                    // Update the concept value directly
                    newData[sectionIndex].data[rowIndex][month] = value;
                } else {
                    // Prevent editing if concept has subconcepts
                    return;
                }
            }
            setData(newData);
        }
    };

    // Handle cell focus
    const handleFocus = (cellKey) => {
        setEditingCell(cellKey);
    };

    // Handle cell blur
    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleAddConcept = (sectionIndex) => {
        setActiveSection(sectionIndex);
        setShowModal(true);
    };

    const handleAddConceptData = ({ conceptName, subconcepts }) => {
        // Construct the new concept with empty month data
        const emptyMonthData = months.reduce(
            (acc, month) => ({ ...acc, [month]: "" }),
            {}
        );

        const newConcept = {
            concept: conceptName,
            ...emptyMonthData,
            subconcepts: subconcepts.map((subName) => ({
                concept: subName,
                ...emptyMonthData,
            })),
        };

        const newData = [...data];
        newData[activeSection].data.push(newConcept);
        setData(newData);
        setShowModal(false);
    };

    const toggleConceptExpansion = (sectionIndex, rowIndex) => {
        const key = `${sectionIndex}-${rowIndex}`;
        setExpandedConcepts((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <section
            className={`bg-white shadow-md ${
                condensed ? "rounded-none p-0" : "rounded-lg p-3"
            } ${condensed ? "my-0" : "my-6"}`}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <TableHeader
                        year={year}
                        months={months}
                        onMonthClick={onMonthClick}
                        showHeader={showHeader}
                        condensed={condensed}
                        paddingClass={paddingClass}
                        paddingClassTitle={paddingClassTitle}
                    />
                    <tbody className="text-gray-600">
                        {data.map((section, sectionIndex) => (
                            <Section
                                key={sectionIndex}
                                sectionData={section}
                                sectionIndex={sectionIndex}
                                months={months}
                                condensed={condensed}
                                paddingClass={paddingClass}
                                paddingClassTitle={paddingClassTitle}
                                onEdit={handleEdit}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                editingCell={editingCell}
                                onAddConcept={handleAddConcept}
                                expandedConcepts={expandedConcepts}
                                toggleConceptExpansion={toggleConceptExpansion}
                                handleAddConcept={handleAddConceptData}
                                currency={currency}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Concept Modal */}
            {showModal && (
                <ConceptModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    handleAddConcept={handleAddConceptData}
                />
            )}
        </section>
    );
};

export default UnifiedTableYear;
