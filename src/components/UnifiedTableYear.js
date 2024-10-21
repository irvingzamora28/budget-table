// UnifiedTableYear.js
import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";
const { incomeRepo, conceptRepo } = require("../database/dbAccessLayer");

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
    const [modalData, setModalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                    updatedTotalForMonth ? updatedTotalForMonth.toFixed(2) : "";
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

    const handleAddConcept = (sectionIndex, rowIndex = null, itemId = null) => {
        setActiveSection(sectionIndex);
        if (rowIndex !== null) {
            // Editing existing concept
            const existingConceptData = data[sectionIndex].data[rowIndex];
            setModalData({
                ...existingConceptData,
                sectionIndex,
                rowIndex,
                itemId,
            });
            setIsEditing(true);
        } else {
            // Adding new concept
            const existingConceptData = data[sectionIndex].data[rowIndex];
            setModalData({
                ...existingConceptData,
                sectionIndex,
                rowIndex,
                itemId,
            });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleAddConceptData = async ({
        conceptName,
        subconcepts,
        isEditing,
        existingConceptData,
    }) => {
        // Construct the new concept with empty month data
        const emptyMonthData = months.reduce(
            (acc, month) => ({ ...acc, [month]: 50 }),
            {}
        );

        const newData = [...data];

        if (isEditing && existingConceptData) {
            // Update existing concept
            const { sectionIndex, rowIndex } = existingConceptData;
            const concept = newData[sectionIndex].data[rowIndex];
            concept.concept = conceptName;

            // Determine if the concept had subconcepts before
            const hadSubconceptsBefore =
                concept.subconcepts && concept.subconcepts.length > 0;

            // Determine if the concept has subconcepts now
            const hasSubconceptsNow = subconcepts.length > 0;

            if (hasSubconceptsNow) {
                // Update subconcepts
                const existingSubconcepts = concept.subconcepts || [];
                concept.subconcepts = subconcepts.map((subName, index) => {
                    // Try to find existing subconcept
                    const existingSub = existingSubconcepts[index];
                    return {
                        concept: subName,
                        // Preserve existing month data if available
                        ...(existingSub || emptyMonthData),
                    };
                });

                // **Recalculate the concept's amounts based on new subconcepts**
                months.forEach((month) => {
                    const totalForMonth = concept.subconcepts.reduce(
                        (total, sub) => total + (parseFloat(sub[month]) || 0),
                        0
                    );
                    concept[month] = totalForMonth
                        ? totalForMonth.toFixed(2)
                        : "";
                });

                // **Reset concept's amounts if subconcepts were added to a concept without subconcepts**
                if (!hadSubconceptsBefore) {
                    months.forEach((month) => {
                        concept[month] = "";
                    });
                }
            } else {
                // Remove subconcepts if none are provided
                concept.subconcepts = [];

                // **Reset concept's amounts if all subconcepts were removed**
                if (hadSubconceptsBefore) {
                    months.forEach((month) => {
                        concept[month] = "";
                    });
                }
                // Else, do not reset amounts since there were no subconcepts before and none now
            }
        } else {
            console.log("Adding new concept");
            
            console.log("Subconcepts:", subconcepts);
            
            
            console.log("existingConceptData:", existingConceptData);
            console.log("conceptName:", conceptName);
            
            // Check if concept exists in the database
            const conceptExists = await conceptRepo.getAllByField(
                "name", conceptName,
            );
            console.log("ConceptExists frontend:", conceptExists);
            console.log("conceptname:", conceptName);
            console.log("subconcepts", subconcepts);
            
            let conceptId = null;
            if (conceptExists.length === 0) {
                // Concept does not exist, add it to the database
                conceptId = await conceptRepo.add({name: conceptName, subconcepts: subconcepts.map((subName) => ({
                    name: subName,
                }))});
            }

            // Get the concept based on the id from the database
            const concept = await conceptRepo.getByIdWithSubconcepts(conceptExists.length === 0 ? conceptId.id : conceptExists[0].id);
            console.log("concept:", concept);
            // Append empty month data to each subconcept
            const subconceptsWithoutName = concept.subconcepts.map((subconcept) => {
                return {...subconcept, ...emptyMonthData};
            });

            await incomeRepo.add({
                concept_id: conceptExists.length === 0 ? conceptId.id : conceptExists[0].id,
                category_id: existingConceptData.itemId,
                ...emptyMonthData,
                subconcepts: subconceptsWithoutName,
            });

            // Add new concept
            const newConcept = {
                concept: conceptName,
                ...emptyMonthData,
                subconcepts: subconcepts.map((subName) => ({
                    name: subName,
                    ...emptyMonthData,
                })),
            };
            newData[activeSection].data.push(newConcept);
        }

        setData(newData);
        setShowModal(false);
        setModalData(null);
        setIsEditing(false);
    };

    const onEditConcept = (sectionIndex, rowIndex) => {
        handleAddConcept(sectionIndex, rowIndex);
    };

    const toggleConceptExpansion = (sectionIndex, rowIndex) => {
        const key = `${sectionIndex}-${rowIndex}`;
        setExpandedConcepts((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    useEffect(() => {
        console.log("Sections:", sections);
    }, []);

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
                                onEditConcept={onEditConcept}
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
                    setShowModal={(value) => {
                        setShowModal(value);
                        if (!value) {
                            setIsEditing(false);
                            setModalData(null);
                        }
                    }}
                    handleAddConcept={handleAddConceptData}
                    existingConceptData={modalData}
                    isEditing={isEditing}
                />
            )}
        </section>
    );
};

export default UnifiedTableYear;
