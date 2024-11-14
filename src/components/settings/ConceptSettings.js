import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import { conceptRepo, categoryRepo } from "../../database/dbAccessLayer";
import conceptSchema from "../../schemas/conceptSchema";
import { useAuth } from "../../context/AuthContext";

const ConceptSettings = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const { user } = useAuth();

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

    // Create function to add a new item
    const onCreate = async (newItem) => {
        try {
            newItem.user_id = user.id;
            const addedId = await conceptRepo.add(newItem);
            const addedConcept = { ...newItem, id: addedId.id };
            setItems((prevItems) => [...prevItems, addedConcept]);
        } catch (error) {
            console.error("Failed to create concept:", error);
        }
    };

    // Update function to modify an existing item
    const onUpdate = async (id, updatedData) => {
        try {
            await conceptRepo.update(id, updatedData);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, ...updatedData } : item
                )
            );
        } catch (error) {
            console.error("Failed to update concept:", error);
        }
    };

    // Delete function to remove an item
    const onDelete = async (id) => {
        try {
            await conceptRepo.delete(id);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete concept:", error);
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