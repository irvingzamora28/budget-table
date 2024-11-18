import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import { categoryRepo, conceptRepo } from "../../database/dbAccessLayer";
import conceptSchema from "../../schemas/conceptSchema";
import { useAuth } from "../../context/AuthContext";
import ConceptService from "../../services/ConceptService";
import BudgetService from "../../services/BudgetService";

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

    // Fetch all concepts and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allConcepts =
                    await conceptRepo.getAllWithSubconcepts();
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

            // Create the concept
            const newConcept = await ConceptService.createConcept({
                name: newItem.name,
                description: newItem.description,
                category_id: newItem.category_id,
                subconcepts: newItem.subconcepts || [],
            });

            // Create the budget
            const budget = await BudgetService.createBudget(
                {
                    concept_id: newConcept.id,
                    category_id: newConcept.category_id,
                    concept: newConcept.name,
                    budget_type,
                    subconcepts: newConcept.subconcepts,
                },
                months
            );

            // Add the new concept and budget to state
            const addedConcept = {
                ...newConcept,
                budget_id: budget.id,
            };
            setItems((prevItems) => [...prevItems, addedConcept]);
        } catch (error) {
            console.error("Failed to create concept and budget:", error);
        }
    };

    // Update function to modify an existing item and update budget_type if category changes
    const onUpdate = async (id, updatedData) => {
        try {
            // Ensure category_id is a number
            updatedData.category_id = Number(updatedData.category_id);

            // Update the concept
            const updatedConcept = await ConceptService.updateConcept(id, {
                name: updatedData.name,
                category_id: updatedData.category_id,
                subconcepts: updatedData.subconcepts || [],
            });

            // Fetch the updated category to get the new budget_type
            const category = categories.find(
                (cat) => cat.id === updatedConcept.category_id
            );
            if (!category) {
                console.error("Category not found");
                return;
            }
            const budget_type = category.type;

            // Find the existing budget
            const existingBudget = await BudgetService.getBudgetByConceptId(id);

            if (existingBudget) {
                // Update the budget
                await BudgetService.updateBudget(
                    existingBudget.id,
                    {
                        concept_id: updatedConcept.id,
                        category_id: updatedConcept.category_id,
                        concept: updatedConcept.name,
                        budget_type,
                        subconcepts: updatedConcept.subconcepts,
                    },
                    months
                );
            }

            // Update state
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? updatedConcept : item
                )
            );
        } catch (error) {
            console.error("Failed to update concept and budget:", error);
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
