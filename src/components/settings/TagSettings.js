import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import { tagRepo } from "../../database/dbAccessLayer"; // Import tagRepo from your data access layer
import tagSchema from "../../schemas/tagSchema";
import { useAuth } from "../../context/AuthContext";

const TagSettings = () => {
    const [items, setItems] = useState([]);
    const { user } = useAuth();

    // Fetch all tags on component mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const allTags = await tagRepo.getAll();
                setItems(allTags); // Set the tags retrieved from the repository
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };

        fetchTags(); // Invoke the function to fetch tags
    }, []); // Empty dependency array to run on mount

    // Create function to add a new item
    const onCreate = async (newItem) => {
        try {
            console.log("Creating tag:", newItem);
            newItem.user_id = user.id;
            const addedId = await tagRepo.add(newItem);
            const addedTag = { ...newItem, id: addedId.id };
            setItems((prevItems) => [...prevItems, addedTag]); // Update state with new tag
        } catch (error) {
            console.error("Failed to create tag:", error);
        }
    };

    // Update function to modify an existing item
    const onUpdate = async (id, updatedData) => {
        try {
            await tagRepo.update(id, updatedData); // Update the tag in the database
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, ...updatedData } : item
                )
            );
        } catch (error) {
            console.error("Failed to update tag:", error);
        }
    };

    // Delete function to remove an item
    const onDelete = async (id) => {
        try {
            await tagRepo.delete(id); // Delete the tag from the database
            setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Update state to remove the tag
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Tag Settings</h2>
            <CrudComponent
                title="Tag Settings"
                items={items} // Pass the fetched items to CrudComponent
                fieldStructure={tagSchema} // Pass the schema from the schemas folder
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
};

export default TagSettings;
