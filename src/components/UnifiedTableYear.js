// UnifiedTableYear.js
import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";
const { incomeRepo, expenseRepo, conceptRepo, budgetRepo } = require("../database/dbAccessLayer");

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

    const onAddConcept = (sectionIndex, rowIndex = null, itemId = null, itemType = null) => {
        setActiveSection(sectionIndex);
        if (rowIndex !== null) {
            // Editing existing concept
            const existingConceptData = data[sectionIndex].data[rowIndex];
            setModalData({
                ...existingConceptData,
                sectionIndex,
                rowIndex,
                itemId,
                itemType,
            });
            setIsEditing(true);
        } else {
            // Adding new concept
            const existingConceptData = data[sectionIndex].data[rowIndex]; // This should be null for new concepts
            setModalData({
                ...existingConceptData,
                sectionIndex,
                rowIndex,
                itemId,
                itemType,
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
        console.log(newData);
        

        if (isEditing && existingConceptData) {
            // Update existing concept
            const { sectionIndex, rowIndex } = existingConceptData;
            const item = newData[sectionIndex].data[rowIndex];
            item.concept = conceptName;

            // Update subconcepts
            const existingSubconcepts = item.subconcepts || [];

            item.subconcepts = subconcepts.map((subconcept, index) => {
                const existingSub = existingSubconcepts[index] || {};
                return {
                    ...subconcept,
                    // Preserve existing month data or start with empty if none
                    ...existingSub,
                    ...emptyMonthData,
                };
            });

            // Remove any extra subconcepts that are no longer provided
            if (subconcepts.length < existingSubconcepts.length) {
                item.subconcepts = item.subconcepts.slice(
                    0,
                    subconcepts.length
                );
            }

            // Recalculate monthly amounts based on updated subconcepts
            months.forEach((month) => {
                const totalForMonth = item.subconcepts.reduce(
                    (total, sub) => total + (parseFloat(sub[month]) || 0),
                    0
                );
                item[month] = totalForMonth ? totalForMonth.toFixed(2) : "";
            });

            // Update the concept in the database but for concepts only pass the concept name and concept_id
            await conceptRepo.update(item.concept_id, {
                name: conceptName,
                subconcepts: subconcepts,
            });
            const concept = await conceptRepo.getByIdWithSubconcepts(
                item.concept_id
            );
            // Iterate over the item's subconcepts If the subconcept doesnt have the property "Jan", add the emptyMonthData
            item.subconcepts = concept.subconcepts.map((subconcept) => {
                if (!subconcept.Jan) {
                    return {
                        ...subconcept,
                        ...emptyMonthData,
                    };
                }
                return subconcept;
            });
            item.budget_type = existingConceptData.budget_type;
            await budgetRepo.update(item.id, item);
        } else {
            // Check if concept exists in the database
            const conceptExists = await conceptRepo.getAllByField(
                "name",
                conceptName
            );

            let conceptId = null;
            if (conceptExists.length === 0) {
                // Concept does not exist, add it to the database

                conceptId = await conceptRepo.add({
                    name: conceptName,
                    subconcepts: subconcepts,
                });
            }

            // Get the concept based on the id from the database
            const concept = await conceptRepo.getByIdWithSubconcepts(
                conceptExists.length === 0 ? conceptId.id : conceptExists[0].id
            );

            // Append empty month data to each subconcept
            const subconceptsWithoutName = concept.subconcepts.map(
                (subconcept) => ({
                    ...subconcept,
                    ...emptyMonthData,
                })
            );
            await budgetRepo.add({
                budget_type: existingConceptData.itemType,
                concept_id:
                    conceptExists.length === 0
                        ? conceptId.id
                        : conceptExists[0].id,
                category_id: existingConceptData.itemId,
                ...emptyMonthData,
                subconcepts: subconceptsWithoutName,
            });
            
            // Add new concept to newData
            const newConcept = {
                concept: conceptName,
                ...emptyMonthData,
                subconcepts: subconcepts.map((concept) => ({
                    name: concept.name,
                    ...emptyMonthData,
                })),
            };
            newData[activeSection].data.push(newConcept);
        }

        // Update state
        setData(newData);
        setShowModal(false);
        setModalData(null);
        setIsEditing(false);
    };

    const onEditConcept = (sectionIndex, rowIndex, itemId, itemType) => {
        onAddConcept(sectionIndex, rowIndex, itemId, itemType);
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
                                onAddConcept={onAddConcept}
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
