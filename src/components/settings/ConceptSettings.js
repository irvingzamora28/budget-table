import React, { useState, useEffect } from "react";
import CrudComponent from "../misc/CrudComponent";
import { conceptRepo } from "../../database/dbAccessLayer"; // Import conceptRepo from your data access layer
import conceptSchema from "../../schemas/conceptSchema";

const ConceptSettings = () => {
    const [items, setItems] = useState([]);

    // Fetch all concepts on component mount
    useEffect(() => {
        const fetchConcepts = async () => {
            try {
                const allConcepts = await conceptRepo.getAll();
                setItems(allConcepts); // Set the concepts retrieved from the repository
            } catch (error) {
                console.error("Failed to fetch concepts:", error);
            }
        };

        fetchConcepts(); // Invoke the function to fetch concepts
    }, []); // Empty dependency array to run on mount

    // Create function to add a new item
    const onCreate = async (newItem) => {
        try {
            console.log("Creating concept:", newItem);

            const addedId = await conceptRepo.add(newItem);
            const addedConcept = { ...newItem, id: addedId.id };
            setItems((prevItems) => [...prevItems, addedConcept]); // Update state with new concept
        } catch (error) {
            console.error("Failed to create concept:", error);
        }
    };

    // Update function to modify an existing item
    const onUpdate = async (id, updatedData) => {
        try {
            await conceptRepo.update(id, updatedData); // Update the concept in the database
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
            await conceptRepo.delete(id); // Delete the concept from the database
            setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Update state to remove the concept
        } catch (error) {
            console.error("Failed to delete concept:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Concept Settings</h2>
            <CrudComponent
                title="Concept Settings"
                items={items} // Pass the fetched items to CrudComponent
                fieldStructure={conceptSchema} // Pass the schema from the schemas folder
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
};

export default ConceptSettings;
