// src/schemas/conceptSchema.js
const conceptSchema = [
    {
        name: "name",
        label: "Concept Name",
        type: "text",
        defaultValue: "",
        validation: {
            required: true,
            minLength: 2,
            maxLength: 50,
        },
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        defaultValue: "",
        validation: {
            maxLength: 200,
        },
    },
];

export default conceptSchema;
