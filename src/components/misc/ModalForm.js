import React, { useState, useEffect } from "react";

const ModalForm = ({ fields, isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [tempFields, setTempFields] = useState({});
    const isEditMode = initialData && Object.keys(initialData).length > 0;

    useEffect(() => {
        if (isOpen) {
            const newFormData = {};
            fields.forEach((field) => {
                newFormData[field.name] =
                    initialData?.[field.name] || field.defaultValue;
            });
            setFormData(newFormData);
            setErrors({});
            // Initialize tempFields for each array field
            const initialTempFields = {};
            fields.forEach((field) => {
                if (field.type === "array") {
                    initialTempFields[field.name] = initializeTempField(field.schema);
                }
            });
            setTempFields(initialTempFields);
        }
    }, [isOpen, fields, initialData]);

    const initializeTempField = (schema) => {
        const temp = {};
        schema.forEach((field) => {
            temp[field.name] = field.defaultValue || "";
        });
        return temp;
    };

    const validateField = (field, value) => {
        const { validation } = field;
        if (!validation) return "";

        if (validation.required && (value === undefined || value === "")) {
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
                return `${field.label} must be one of the following types: ${validation.acceptedFileTypes.join(
                    ", "
                )}`;
            }
        }
        return "";
    };

    // Handle changes for main fields
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

    // Handle changes for temporary nested fields
    const handleTempFieldChange = (e, fieldName) => {
        const { name, value, type, checked, files } = e.target;
        let newValue;

        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "file") {
            newValue = files[0] ? files[0].name : "";
        } else {
            newValue = value;
        }

        setTempFields((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [name]: newValue,
            },
        }));
    };

    // Handle changes for nested fields within arrays
    const handleNestedChange = (e, fieldName, index, subFieldName) => {
        const { value, type, checked, files } = e.target;
        let newValue;

        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "file") {
            newValue = files[0] ? files[0].name : "";
        } else {
            newValue = value;
        }

        setFormData((prev) => {
            const updatedChildren = [...(prev[fieldName] || [])];
            updatedChildren[index] = {
                ...updatedChildren[index],
                [subFieldName]: newValue,
            };
            return { ...prev, [fieldName]: updatedChildren };
        });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const field = fields.find((f) => f.name === name);
        if (field) {
            const error = validateField(field, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        fields.forEach((field) => {
            // Skip array fields as their validation is handled separately
            if (field.type !== "array") {
                const error = validateField(field, formData[field.name]);
                if (error) {
                    newErrors[field.name] = error;
                }
            } else if (field.validation) {
                const arrayLength = (formData[field.name] || []).length;
                if (
                    field.validation.minLength !== undefined &&
                    arrayLength < field.validation.minLength
                ) {
                    newErrors[field.name] = `${field.label} must have at least ${field.validation.minLength} items`;
                }
                if (
                    field.validation.maxLength !== undefined &&
                    arrayLength > field.validation.maxLength
                ) {
                    newErrors[field.name] = `${field.label} must have no more than ${field.validation.maxLength} items`;
                }
            }
        });

        // Validate nested array items
        fields.forEach((field) => {
            if (field.type === "array" && field.schema) {
                const items = formData[field.name] || [];
                items.forEach((item, index) => {
                    field.schema.forEach((subField) => {
                        const error = validateField(subField, item[subField.name]);
                        if (error) {
                            newErrors[`${field.name}[${index}].${subField.name}`] = error;
                        }
                    });
                });
            }
        });

        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
        } else {
            setErrors(newErrors);
        }
    };

    const addChild = (fieldName) => {
        const field = fields.find((f) => f.name === fieldName);
        if (!field || field.type !== "array") return;

        const temp = tempFields[fieldName];
        // Check if all required fields in temp are filled
        let canAdd = true;
        field.schema.forEach((subField) => {
            if (subField.validation?.required && !temp[subField.name]) {
                canAdd = false;
                setErrors((prev) => ({
                    ...prev,
                    [`${fieldName}_temp_${subField.name}`]: `${subField.label} is required`,
                }));
            }
        });

        if (!canAdd) return;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), { ...temp }],
        }));
        // Reset the tempFields for this field
        setTempFields((prev) => ({
            ...prev,
            [fieldName]: initializeTempField(field.schema),
        }));
        // Clear errors related to temp fields
        const updatedErrors = { ...errors };
        field.schema.forEach((subField) => {
            delete updatedErrors[`${fieldName}_temp_${subField.name}`];
        });
        setErrors(updatedErrors);
    };

    const removeChild = (fieldName, index) => {
        setFormData((prev) => {
            const updatedChildren = [...(prev[fieldName] || [])];
            updatedChildren.splice(index, 1);
            return { ...prev, [fieldName]: updatedChildren };
        });
    };

    const renderField = (field, index) => {
        return (
            <div key={field.name} className="mb-4">
                <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                    {field.label}
                </label>
                {field.type === "text" && (
                    <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        autoFocus={index == 0 ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border p-2 rounded ${
                            errors[field.name] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                )}
                {field.type === "textarea" && (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        autoFocus={index == 0 ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border p-2 rounded ${
                            errors[field.name] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                )}
                {field.type === "select" && (
                    <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        autoFocus={index == 0 ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border p-2 rounded ${
                            errors[field.name] ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
                {field.type === "radio" && (
                    <div>
                        {field.options.map((option) => (
                            <div key={option.value} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id={`${field.name}-${option.value}`}
                                    name={field.name}
                                    autoFocus={index == 0 ? true: false}
                                    value={option.value}
                                    checked={formData[field.name] === option.value}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="mr-2"
                                />
                                <label htmlFor={`${field.name}-${option.value}`}>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                {field.type === "color" && (
                    <input
                        type="color"
                        id={field.name}
                        name={field.name}
                        autoFocus={index == 0 ? true: false}
                        value={formData[field.name] || "#000000"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border h-12 p-2 rounded ${
                            errors[field.name] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                )}
                {field.type === "file" && (
                    <input
                        type="file"
                        id={field.name}
                        name={field.name}
                        autoFocus={index == 0 ? true: false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border p-2 rounded ${
                            errors[field.name] ? "border-red-500" : "border-gray-300"
                        }`}
                        accept={field.validation?.acceptedFileTypes?.join(",")}
                    />
                )}
                {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
            </div>
        );
    };

    const renderNestedFields = (field) => {
        const subSchema = field.schema;
        const temp = tempFields[field.name] || {};

        return (
            <div key={field.name} className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    {field.label}
                </label>
                <div className="mb-4">
                    {subSchema.map((subField) => (
                        <div key={subField.name} className="mb-2">
                            <label
                                htmlFor={`${field.name}_temp_${subField.name}`}
                                className="block text-xs font-medium mb-1"
                            >
                                {subField.label}
                            </label>
                            {subField.type === "text" && (
                                <input
                                    type="text"
                                    id={`${field.name}_temp_${subField.name}`}
                                    name={subField.name}
                                    value={temp[subField.name] || ""}
                                    onChange={(e) => handleTempFieldChange(e, field.name)}
                                    className={`w-full border p-1 rounded ${
                                        errors[`${field.name}_temp_${subField.name}`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {subField.type === "textarea" && (
                                <textarea
                                    id={`${field.name}_temp_${subField.name}`}
                                    name={subField.name}
                                    value={temp[subField.name] || ""}
                                    onChange={(e) => handleTempFieldChange(e, field.name)}
                                    className={`w-full border p-1 rounded ${
                                        errors[`${field.name}_temp_${subField.name}`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {subField.type === "select" && (
                                <select
                                    id={`${field.name}_temp_${subField.name}`}
                                    name={subField.name}
                                    value={temp[subField.name] || subField.defaultValue}
                                    onChange={(e) => handleTempFieldChange(e, field.name)}
                                    className={`w-full border p-1 rounded ${
                                        errors[`${field.name}_temp_${subField.name}`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {subField.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {subField.type === "radio" && (
                                <div>
                                    {subField.options.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center mb-1"
                                        >
                                            <input
                                                type="radio"
                                                id={`${field.name}_temp_${subField.name}-${option.value}`}
                                                name={subField.name}
                                                value={option.value}
                                                checked={temp[subField.name] === option.value}
                                                onChange={(e) => handleTempFieldChange(e, field.name)}
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor={`${field.name}_temp_${subField.name}-${option.value}`}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {subField.type === "color" && (
                                <input
                                    type="color"
                                    id={`${field.name}_temp_${subField.name}`}
                                    name={subField.name}
                                    value={temp[subField.name] || subField.defaultValue}
                                    onChange={(e) => handleTempFieldChange(e, field.name)}
                                    className={`w-full border h-8 p-1 rounded ${
                                        errors[`${field.name}_temp_${subField.name}`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            )}
                            {subField.type === "file" && (
                                <input
                                    type="file"
                                    id={`${field.name}_temp_${subField.name}`}
                                    name={subField.name}
                                    onChange={(e) => handleTempFieldChange(e, field.name)}
                                    className={`w-full border p-1 rounded ${
                                        errors[`${field.name}_temp_${subField.name}`]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    accept={subField.validation?.acceptedFileTypes?.join(",")}
                                />
                            )}
                            {errors[`${field.name}_temp_${subField.name}`] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[`${field.name}_temp_${subField.name}`]}
                                </p>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addChild(field.name)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        Add {field.label.slice(0, -1)}
                    </button>
                </div>
                {formData[field.name]?.length > 0 && (
                    <table className="min-w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-200">
                                {field.schema.map((subField) => (
                                    <th
                                        key={subField.name}
                                        className="border px-4 py-2 text-left"
                                    >
                                        {subField.label}
                                    </th>
                                ))}
                                <th className="border px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData[field.name].map((child, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    {field.schema.map((subField) => (
                                        <td key={subField.name} className="border px-4 py-2">
                                            {subField.type === "file"
                                                ? child[subField.name] || "No file selected"
                                                : child[subField.name]}
                                        </td>
                                    ))}
                                    <td className="border px-4 py-2">
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => removeChild(field.name, index)}
                                        >
                                            &#10005;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 m-4 rounded-md w-full max-w-2xl overflow-y-auto max-h-full">
                <h3 className="text-lg font-semibold mb-4">
                    {isEditMode ? "Edit Item" : "Create Item"}
                </h3>
                <form onSubmit={handleSubmit}>
                    {fields.map((field, index) =>
                        field.type === "array" ? renderNestedFields(field) : renderField(field, index)
                    )}
                    <div className="flex justify-end space-x-4 mt-4">
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
                            {isEditMode ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ModalForm;
