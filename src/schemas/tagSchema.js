// src/schemas/tagSchema.js
const tagSchema = [
    {
        name: "name",
        label: "Tag Name",
        type: "text",
        defaultValue: "",
        validation: {
            required: true,
            minLength: 2,
            maxLength: 50
        }
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        defaultValue: "",
        validation: {
            maxLength: 200
        }
    },
    {
        name: "color",
        label: "Color",
        type: "color",
        defaultValue: "#000000",
        validation: {
            required: true,
            pattern: /^#[0-9A-Fa-f]{6}$/
        }
    },
];

export default tagSchema;