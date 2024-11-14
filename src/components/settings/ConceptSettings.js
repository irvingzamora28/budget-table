import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import {
    conceptRepo,
    categoryRepo,
    budgetRepo,
} from "../../database/dbAccessLayer";
import conceptSchema from "../../schemas/conceptSchema";
import { useAuth } from "../../context/AuthContext";

const ConceptSettings = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const { user } = useAuth();

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

    // Helper function to create empty month data
    const createEmptyMonthData = (quantity = 0) => {
        return months.reduce(
            (acc, month) => ({ ...acc, [month]: quantity }),
            {}
        );
    };

    // Helper function to merge existing monthly data with updated subconcepts
    const prepareSubconcepts = (
        updatedSubconcepts,
        existingBudgetSubconcepts
    ) => {
        return updatedSubconcepts.map((updatedSubconcept) => {
            // Find the corresponding subconcept in the existing budget by ID
            const existingSubconcept = existingBudgetSubconcepts.find(
                (sub) => sub.id === updatedSubconcept.id
            );

            if (existingSubconcept) {
                // Merge existing monthly data with updated subconcept details
                return {
                    ...updatedSubconcept,
                    ...months.reduce((acc, month) => {
                        acc[month] = existingSubconcept[month] || 0;
                        return acc;
                    }, {}),
                };
            } else {
                // Initialize monthly data for new subconcepts
                return {
                    ...updatedSubconcept,
                    ...createEmptyMonthData(0),
                };
            }
        });
    };

    // Fetch all concepts and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allConcepts = await conceptRepo.getAllWithSubconcepts();
                const allCategories = await categoryRepo.getAll();
                setItems(allConcepts);
                setCategories(allCategories);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    // Create function to add a new item with budget_type from category
    const onCreate = async (newItem) => {
        try {
            // Ensure category_id is a number
            newItem.category_id = Number(newItem.category_id);
            newItem.user_id = user.id;

            // Fetch the category to get budget_type
            const category = categories.find(
                (cat) => cat.id === newItem.category_id
            );
            if (!category) {
                console.error("Category not found");
                return;
            }
            const budget_type = category.type;

            // Add the concept
            const addedConceptResult = await conceptRepo.add(newItem);
            const conceptId = addedConceptResult.id;

            // Get the concept with its subconcepts
            const concept = await conceptRepo.getByIdWithSubconcepts(conceptId);

            // Prepare the budget data
            const budgetData = {
                budget_type,
                concept_id: conceptId,
                category_id: newItem.category_id,
                concept: concept.name,
                ...createEmptyMonthData(),
                subconcepts: prepareSubconcepts(concept.subconcepts, []), // New concept, so no existing data
            };

            // Create the budget
            const addedBudgetResult = await budgetRepo.add(budgetData);

            // Update state with the new concept
            const addedConcept = {
                ...concept,
                budget_id: addedBudgetResult.id,
            };
            setItems((prevItems) => [...prevItems, addedConcept]);
        } catch (error) {
            console.error("Failed to create concept and budget:", error);
            throw error;
        }
    };

    // Update function to modify an existing item and update budget_type if category changes
    const onUpdate = async (id, updatedData) => {
        try {
            // Ensure category_id is a number
            updatedData.category_id = Number(updatedData.category_id);

            // Update the concept
            await conceptRepo.update(id, updatedData);

            // Get the updated concept with its subconcepts
            const updatedConcept = await conceptRepo.getByIdWithSubconcepts(id);

            // Fetch the updated category to get the new budget_type
            const category = categories.find(
                (cat) => cat.id === updatedConcept.category_id
            );
            if (!category) {
                console.error("Category not found");
                return;
            }
            const budget_type = category.type;

            // Find the existing budget for this concept
            const existingBudget = await budgetRepo.getAll({ concept_id: id });

            if (existingBudget && existingBudget.length > 0) {
                const budget = existingBudget[0];

                // Prepare updated budget data, merging existing monthly data for subconcepts
                const updatedBudgetData = {
                    ...budget,
                    budget_type,
                    concept: updatedConcept.name,
                    category_id: updatedConcept.category_id,
                    subconcepts: prepareSubconcepts(
                        updatedConcept.subconcepts,
                        budget.subconcepts || []
                    ),
                };

                // Update the budget
                await budgetRepo.update(budget.id, updatedBudgetData);
            }

            // Update the state
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? updatedConcept : item
                )
            );
        } catch (error) {
            console.error("Failed to update concept and budget:", error);
            throw error;
        }
    };

    // Delete function to remove an item
    const onDelete = async (id) => {
        try {
            // Find and delete associated budget first
            const existingBudget = await budgetRepo.getAll({ concept_id: id });
            if (existingBudget && existingBudget.length > 0) {
                await budgetRepo.delete(existingBudget[0].id);
            }

            // Delete the concept
            await conceptRepo.delete(id);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete concept and budget:", error);
            throw error;
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Concept Settings</h2>
            <CrudComponent
                title="Concept Settings"
                items={items}
                fieldStructure={conceptSchema.map((field) =>
                    field.name === "category_id"
                        ? {
                              ...field,
                              defaultValue:
                                  categories.length > 0
                                      ? categories[0].id
                                      : null,
                              options: categories.map((category) => ({
                                  value: category.id,
                                  label: category.name,
                              })),
                          }
                        : field
                )}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
};

export default ConceptSettings;
