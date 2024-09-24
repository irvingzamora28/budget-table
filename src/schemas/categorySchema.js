// src/schemas/categorySchema.js
const categorySchema = [
    {
        name: "name",
        label: "Category Name",
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
    {
        name: "type",
        label: "Type",
        type: "select",
        options: [
            { value: "INCOME", label: "Income" },
            { value: "EXPENSE", label: "Expense" },
            { value: "SAVING", label: "Saving" },
            { value: "INVESTMENT", label: "Investment" },
        ],
        defaultValue: "INCOME",
        validation: {
            required: true,
        },
    },
];

export default categorySchema;