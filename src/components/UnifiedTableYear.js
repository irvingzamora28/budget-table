// UnifiedTableYear.js
import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";
import MonthlyTotalsRow from "./MonthlyTotalsRow";
const { conceptRepo, budgetRepo } = require("../database/dbAccessLayer");

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
    const [monthlyTotals, setMonthlyTotals] = useState({});

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

    useEffect(() => {
        const calculateMonthlyTotals = () => {
            const totals = {};
            months.forEach((month) => {
                totals[month] = 0;
            });

            data.forEach((section) => {
                section.data.forEach((concept) => {
                    months.forEach((month) => {
                        const value = parseFloat(concept[month]) || 0;
                        totals[month] += value;
                    });
                });
            });

            return totals;
        };

        setMonthlyTotals(calculateMonthlyTotals());
    }, [data]); // Re-run the effect whenever `data` changes

    // Handle editing of cells
    const handleEdit = async (
        event,
        sectionIndex,
        rowIndex,
        month,
        budgetId,
        isSubconcept = false,
        subconceptIndex = null,
        cellKey = null
    ) => {
        if (editingCell !== cellKey) {
            setEditingCell(cellKey); // Set editingCell when starting to edit
        }
        const value = event.target.value.replace(/[^0-9.]/g, "");
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
    const handleFocus = (event) => {
        event.target.select();
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
        quantity = 0,
    }) => {
        const emptyMonthData = months.reduce(
            (acc, month) => ({ ...acc, [month]: quantity }),
            {}
        );
        const newData = [...data];

        const prepareSubconcepts = (
            updatedSubconcepts,
            existingSubconcepts = []
        ) => {
            return updatedSubconcepts.map((updatedSubconcept) => {
                const existingSubconcept = existingSubconcepts.find(
                    (sub) => sub.id === updatedSubconcept.id
                );
                console.log("updatedSubconcept:", updatedSubconcept);
                
                if (existingSubconcept) {
                    return {
                        ...updatedSubconcept,
                        ...months.reduce((acc, month) => {
                            acc[month] = existingSubconcept[month] || 0;
                            return acc;
                        }, {}),
                    };
                } else {
                    return {
                        ...updatedSubconcept,
                        ...emptyMonthData,
                    };
                }
            });
        };

        // Check if we are editing an existing concept or creating a new one
        if (isEditing && existingConceptData) {
            console.log("existingConceptData:", existingConceptData);
            console.log("subconcepts:", subconcepts);
            console.log("isEditing:", isEditing);
            
            
            const { sectionIndex, rowIndex } = existingConceptData;
            const item = newData[sectionIndex].data[rowIndex];

            // Fetch and update the concept
            const updatedConcept = {
                name: conceptName,
                category_id: existingConceptData.category_id,
                subconcepts: subconcepts,
            };
            await conceptRepo.update(
                existingConceptData.concept_id,
                updatedConcept
            );

            // Fetch the updated concept with its subconcepts
            const concept = await conceptRepo.getByIdWithSubconcepts(
                existingConceptData.concept_id
            );

            // Find the existing budget
            const existingBudget = await budgetRepo.getAll({
                concept_id: concept.id,
            });
            const budget = existingBudget.length > 0 ? existingBudget[0] : null;

            // Prepare updated budget data
            const updatedBudgetData = {
                ...(budget || {}),
                budget_type: existingConceptData.budget_type,
                concept_id: concept.id,
                concept: concept.name,
                category_id: concept.category_id,
                subconcepts: prepareSubconcepts(
                    concept.subconcepts,
                    budget ? budget.subconcepts : []
                ),
            };

            // Update the budget
            if (budget) {
                await budgetRepo.update(budget.id, updatedBudgetData);
            } else {
                const newBudget = await budgetRepo.add(updatedBudgetData);
                item.id = newBudget.id;
            }

            // Update the state
            item.concept = conceptName;
            item.subconcepts = updatedBudgetData.subconcepts;
            months.forEach((month) => {
                item[month] = updatedBudgetData[month];
            });
        } else {
            // Create a new concept
            const newConcept = {
                name: conceptName,
                category_id: existingConceptData.itemId,
                subconcepts: subconcepts,
            };
            const addedConcept = await conceptRepo.add(newConcept);

            // Fetch the added concept with its subconcepts
            const concept = await conceptRepo.getByIdWithSubconcepts(
                addedConcept.id
            );

            // Prepare the budget data
            const budgetData = {
                budget_type: existingConceptData.itemType || "INCOME",
                concept_id: concept.id,
                category_id: concept.category_id,
                concept: concept.name,
                ...emptyMonthData,
                subconcepts: prepareSubconcepts(concept.subconcepts),
            };

            // Create the budget
            const addedBudget = await budgetRepo.add(budgetData);

            // Add the new concept and budget to the state
            const newConceptData = {
                ...concept,
                id: addedBudget.id,
                ...emptyMonthData,
                subconcepts: budgetData.subconcepts,
            };
            newConceptData.concept = conceptName;
            newData[activeSection].data.push(newConceptData);
        }

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
                    <tfoot>
                        <MonthlyTotalsRow
                            monthlyTotals={monthlyTotals}
                            currency={currency}
                        />
                    </tfoot>
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
