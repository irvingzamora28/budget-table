// UnifiedTableYear.js
import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";
const {
    conceptRepo,
    budgetRepo,
} = require("../database/dbAccessLayer");

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
    // UnifiedTableYear.js
    const handleEdit = async (
        e,
        sectionIndex,
        rowIndex,
        month,
        budgetId,
        isSubconcept = false,
        subconceptIndex = null
    ) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        if (/^\d*\.?\d*$/.test(value)) {
            const newData = [...data];
            const budget = newData[sectionIndex].data[rowIndex];

            if (isSubconcept) {
                // Update the subconcept value
                const subconcept =
                    newData[sectionIndex].data[rowIndex].subconcepts[
                        subconceptIndex
                    ];
                subconcept[month] = value;

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
                // Update the concept value directly
                budget[month] = value;
            }
            console.log("Updated budget:", budget);
            
            // Update the database for the budget by passing the entire object
            await budgetRepo.update(budget.id, {
                ...budget,
            });

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

    const onAddConcept = (
        sectionIndex,
        rowIndex = null,
        itemId = null,
        itemType = null
    ) => {
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
    
        // Helper function to get or create a concept and return its ID
        const getOrCreateConceptId = async () => {
            const conceptExists = await conceptRepo.getAllByField(
                "name",
                conceptName
            );
    
            if (conceptExists.length === 0) {
                // Concept does not exist, add it to the database
                const conceptId = await conceptRepo.add({
                    name: conceptName,
                    subconcepts: subconcepts,
                });
                return conceptId.id;
            } else {
                return conceptExists[0].id;
            }
        };
    
        // Helper function to prepare subconcepts with empty month data
        const prepareSubconcepts = (subconceptsList) =>
            subconceptsList.map((subconcept) => ({
                ...subconcept,
                ...emptyMonthData,
            }));
    
        // Helper function to calculate monthly amounts based on subconcepts
        const calculateMonthlyAmounts = (item) => {
            months.forEach((month) => {
                const totalForMonth = item.subconcepts.reduce(
                    (total, sub) => total + (parseFloat(sub[month]) || 0),
                    0
                );
                item[month] = totalForMonth ? totalForMonth.toFixed(2) : "";
            });
        };
    
        // Helper function to update concept in the database
        const updateConceptInDatabase = async (conceptId, item) => {
            await conceptRepo.update(conceptId, {
                name: item.concept,
                subconcepts: item.subconcepts,
            });
            const concept = await conceptRepo.getByIdWithSubconcepts(conceptId);
            // Update item subconcepts with data from database
            item.subconcepts = prepareSubconcepts(concept.subconcepts);
        };
    
        // Get or create concept ID
        const conceptId = await getOrCreateConceptId();
    
        if (isEditing && existingConceptData) {
            // Update existing concept
            const { sectionIndex, rowIndex } = existingConceptData;
            const item = newData[sectionIndex].data[rowIndex];
            item.concept = conceptName;
            item.concept_id = conceptId;
            item.budget_type = existingConceptData.budget_type;
    
            // Update subconcepts
            item.subconcepts = prepareSubconcepts(subconcepts);
    
            // Recalculate monthly amounts based on updated subconcepts
            calculateMonthlyAmounts(item);
    
            // Update the concept and budget in the database
            await updateConceptInDatabase(conceptId, item);
            await budgetRepo.update(item.id, item);
        } else {
            // Create new concept item
            const newConcept = {
                budget_type: existingConceptData.itemType,
                concept_id: conceptId,
                concept: conceptName,
                category_id: existingConceptData.itemId,
                ...emptyMonthData,
                subconcepts: prepareSubconcepts(subconcepts),
            };
    
            // Add to budgetRepo
            const budget_id = await budgetRepo.add({
                ...newConcept,
            });
    
    
            // Append the budget_id to the newConcept
            newConcept.id = budget_id.id;
    
            // Add new concept to newData
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
