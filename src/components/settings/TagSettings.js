import React, { useState } from "react";
import CrudComponent from "../misc/CrudComponent";

const TagSettings = () => {
    // Initial items for the CRUD table
    const initialItems = [
        { id: 1, name: "Tag name 1", description: "Description for Tag 1", status: "ACTIVE" },
        { id: 2, name: "Tag 2", description: "Description different for Tag 2", status: "INACTIVE" },
        { id: 3, name: "Tag 3", description: "Description for Tag 3", status: "OFFLINE" },
        { id: 4, name: "Tag 4", description: "Description for Tag 4", status: "ACTIVE" },
        { id: 5, name: "Tag 5", description: "Description for Tag 5", status: "INACTIVE" },
        { id: 6, name: "Tag 6", description: "Description for Tag 6", status: "OFFLINE" },
    ];

    const [items, setItems] = useState(initialItems);

    // Create function to add a new item
    const onCreate = () => {
        const newItem = {
            id: items.length + 1,
            name: `Tag ${items.length + 1}`,
            description: `Description for Tag ${items.length + 1}`,
            status: "ACTIVE",
        };
        setItems([...items, newItem]);
    };

    // Update function to modify an existing item
    const onUpdate = (id) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, name: `${item.name} (Updated)` } : item
        );
        setItems(updatedItems);
    };

    // Delete function to remove an item
    const onDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Tag Settings</h2>
            <CrudComponent
                title="Tag Settings"
                items={items}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
};

export default TagSettings;
