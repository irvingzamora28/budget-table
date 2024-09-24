import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import { categoryRepo } from "../../database/dbAccessLayer"; // Import categoryRepo from your data access layer
import categorySchema from "../../schemas/categorySchema";

const CategorySettings = () => {
    const [items, setItems] = useState([]);

    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await categoryRepo.getAll();
                setItems(allCategories); // Set the categories retrieved from the repository
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories(); // Invoke the function to fetch categories
    }, []); // Empty dependency array to run on mount

    // Create function to add a new item
    const onCreate = async (newItem) => {
        try {
            console.log("Creating category:", newItem);

            const addedId = await categoryRepo.add(newItem);
            const addedCategory = { ...newItem, id: addedId.id };
            setItems((prevItems) => [...prevItems, addedCategory]); // Update state with new category
        } catch (error) {
            console.error("Failed to create category:", error);
        }
    };

    // Update function to modify an existing item
    const onUpdate = async (id, updatedData) => {
        try {
            await categoryRepo.update(id, updatedData); // Update the category in the database
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, ...updatedData } : item
                )
            );
        } catch (error) {
            console.error("Failed to update category:", error);
        }
    };

    // Delete function to remove an item
    const onDelete = async (id) => {
        try {
            await categoryRepo.delete(id); // Delete the category from the database
            setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Update state to remove the category
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Category Settings</h2>
            <CrudComponent
                title="Category Settings"
                items={items} // Pass the fetched items to CrudComponent
                fieldStructure={categorySchema} // Pass the schema from the schemas folder
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
};

export default CategorySettings;
