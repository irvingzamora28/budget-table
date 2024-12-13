// UnifiedTableYear.js
import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Section from "./Section";
import ConceptModal from "./ConceptModal";
import CategoryModal from "./CategoryModal";
import MonthlyTotalsRow from "./MonthlyTotalsRow";
const ConceptService = require("../services/ConceptService");
const BudgetService = require("../services/BudgetService");
const CategoryService = require("../services/CategoryService"); // Import CategoryService

const UnifiedTableYear = ({
    sections,
    year,
    condensed = false,
    onMonthClick,
    showHeader = true,
    currency = "€",
}) => {
    const [data, setData] = useState(sections);
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [expandedConcepts, setExpandedConcepts] = useState({});
    const [modalData, setModalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

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
                        if (concept.budget_type === 'EXPENSE' || concept.budget_type === 'SAVINGS') {
                            const value = parseFloat(concept[month]) || 0;
                            totals[month] += value;
                        }
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
            await BudgetService.updateBudget(budget.id, {...budget}, months);

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

        const newData = [...data];

        if (isEditing && existingConceptData) {
            const { sectionIndex, rowIndex } = existingConceptData;
            const item = newData[sectionIndex].data[rowIndex];
            console.log("Existing concept data:", existingConceptData);
            console.log("Updated concept data:", item);

            // Update the concept
            const updatedConcept = await ConceptService.updateConcept(
                existingConceptData.concept_id,
                {
                    name: conceptName,
                    category_id: existingConceptData.category_id,
                    subconcepts,
                }
            );

            // Update the budget
            const updatedBudget = await BudgetService.updateBudget(
                item.id,
                {
                    concept_id: updatedConcept.id,
                    category_id: updatedConcept.category_id,
                    concept: updatedConcept.name,
                    budget_type: existingConceptData.budget_type,
                    subconcepts,
                },
                months
            );

            // Update state
            item.concept = updatedConcept.name;
            item.subconcepts = updatedBudget.subconcepts;
            months.forEach((month) => {
                item[month] = updatedBudget[month];
            });
        } else {
            // Create a new concept
            const newConcept = await ConceptService.createConcept({
                name: conceptName,
                description: "",
                category_id: existingConceptData.itemId,
                subconcepts,
            });

            // Create the budget
            const newBudget = await BudgetService.createBudget(
                {
                    concept_id: newConcept.id,
                    category_id: newConcept.category_id,
                    concept: newConcept.name,
                    budget_type: existingConceptData.itemType || "INCOME",
                    subconcepts: newConcept.subconcepts,
                },
                months,
                quantity // Apply quantity to all months
            );

            // Add the new concept and budget to the state
            const newConceptData = {
                ...newConcept,
                concept_id: newConcept.id,
                ...months.reduce((acc, month) => {
                    acc[month] = quantity; // Apply quantity to months in the UI
                    return acc;
                }, {}),
                subconcepts: newBudget.subconcepts,
            };
            newConceptData.concept = conceptName;
            newConceptData.id = newBudget.id;
            newConceptData.budget_type =
                existingConceptData.itemType || "INCOME";
            console.log("newConceptData", newConceptData);

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

    const handleEditCategory = (sectionIndex) => {
        const category = data[sectionIndex];
        console.log("Category data:", category);
        
        const concepts = category.data.map(concept => ({
            id: concept.concept_id,
            name: concept.concept,
            budget: concept
        }));
        setActiveCategory({ ...category, concepts });
        setShowCategoryModal(true);
    };

    const handleSaveCategoryTitle = async (newTitle) => {
        try {
            await CategoryService.updateCategoryTitle(activeCategory.id, newTitle);
            const updatedData = data.map((section) =>
                section.id === activeCategory.id
                    ? { ...section, title: newTitle }
                    : section
            );
            setData(updatedData);
            setShowCategoryModal(false);
        } catch (error) {
            console.error("Error saving category title:", error);
        }
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
                                onEditCategory={() => handleEditCategory(sectionIndex)} // Pass the handler
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

            {/* Category Modal */}
            {showCategoryModal && (
                <CategoryModal
                    showModal={showCategoryModal}
                    setShowModal={setShowCategoryModal}
                    category={activeCategory}
                    onSave={handleSaveCategoryTitle}
                />
            )}
        </section>
    );
};

export default UnifiedTableYear;
