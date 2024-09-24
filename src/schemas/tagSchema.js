// src/schemas/tagSchema.js
const tagSchema = [
    { name: "name", label: "Tag Name", type: "text", defaultValue: "" },
    { name: "description", label: "Description", type: "textarea", defaultValue: "" },
    { name: "color", label: "Color", type: "color", defaultValue: "#000000" },
];

export default tagSchema;