import React, { useState, useEffect } from "react";

const ModalForm = ({ fields, isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({});

    // Ensure formData is populated with initialData if provided (edit mode)
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData); // Initialize with existing data if editing
            } else {
                const initialForm = {};
                fields.forEach((field) => {
                    // If it's a select field, set the default value to the first option
                    if (field.type === "select") {
                        initialForm[field.name] = field.options[0].value; // Set first option as default
                    } else {
                        initialForm[field.name] =
                            field.type === "radio" ? false : "";
                    }
                });
                setFormData(initialForm);
            }
        }
    }, [initialData, fields, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "radio" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    {initialData ? "Edit Item" : "Create Item"}
                </h3>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                {field.label}
                            </label>
                            {field.type === "text" && (
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            )}
                            {field.type === "textarea" && (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            )}
                            {field.type === "select" && (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                >
                                    {field.options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {field.type === "radio" && (
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        checked={formData[field.name]}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span>{field.label}</span>
                                </div>
                            )}
                            {field.type === "color" && (
                                <input
                                    type="color"
                                    name={field.name}
                                    value={formData[field.name] || "#000000"}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 h-12 p-2 rounded"
                                />
                            )}
                            {field.type === "file" && (
                                <input
                                    type="file"
                                    name={field.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalForm;
