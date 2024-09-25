import React, { useState, useEffect } from "react";

const ModalForm = ({ fields, isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const isEditMode = initialData && Object.keys(initialData).length > 0;

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                const newFormData = {};
                fields.forEach((field) => {
                    newFormData[field.name] =
                        initialData[field.name] !== undefined
                            ? initialData[field.name]
                            : field.defaultValue;
                });
                setFormData(newFormData);
            } else {
                const newFormData = {};
                fields.forEach((field) => {
                    newFormData[field.name] = field.defaultValue;
                });
                setFormData(newFormData);
            }
            setErrors({});
        }
    }, [isOpen, fields, initialData, isEditMode]);

    const validateField = (field, value) => {
        const { validation } = field;
        if (!validation) return "";

        if (validation.required && !value) {
            return `${field.label} is required`;
        }
        if (validation.minLength && value.length < validation.minLength) {
            return `${field.label} must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
            return `${field.label} must be no more than ${validation.maxLength} characters`;
        }
        if (validation.pattern && !validation.pattern.test(value)) {
            return `${field.label} is not in a valid format`;
        }
        if (field.type === "file" && validation.acceptedFileTypes) {
            const fileExtension = value.split(".").pop().toLowerCase();
            if (!validation.acceptedFileTypes.includes(fileExtension)) {
                return `${
                    field.label
                } must be one of the following types: ${validation.acceptedFileTypes.join(
                    ", "
                )}`;
            }
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        let newValue;

        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "file") {
            newValue = files[0] ? files[0].name : "";
        } else {
            newValue = value;
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;

        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "file") {
            newValue = files[0] ? files[0].name : "";
        } else {
            newValue = value;
        }

        const field = fields.find((f) => f.name === name);
        const error = validateField(field, newValue);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        fields.forEach((field) => {
            const error = validateField(field, formData[field.name]);
            if (error) {
                newErrors[field.name] = error;
            }
        });

        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
        } else {
            setErrors(newErrors);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 m-4 rounded-md w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    {isEditMode ? "Edit Item" : "Create Item"}
                </h3>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                {field.label}
                            </label>
                            {field.type === "text" && (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded ${
                                        errors[field.name]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {field.type === "textarea" && (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded ${
                                        errors[field.name]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {field.type === "select" && (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded ${
                                        errors[field.name]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                <div>
                                    {field.options.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center mb-2"
                                        >
                                            <input
                                                type="radio"
                                                id={`${field.name}-${option.value}`}
                                                name={field.name}
                                                value={option.value}
                                                checked={
                                                    formData[field.name] ===
                                                    option.value
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor={`${field.name}-${option.value}`}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {field.type === "color" && (
                                <input
                                    type="color"
                                    name={field.name}
                                    value={formData[field.name] || "#000000"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border h-12 p-2 rounded ${
                                        errors[field.name]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {field.type === "file" && (
                                <input
                                    type="file"
                                    name={field.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded ${
                                        errors[field.name]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    accept={field.validation?.acceptedFileTypes?.join(
                                        ","
                                    )}
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[field.name]}
                                </p>
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
