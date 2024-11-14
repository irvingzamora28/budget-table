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
    {
        name: "category_id",
        label: "Category",
        type: "select",
        defaultValue: "",
        validation: {
            required: true,
        },
        // The options for the category field will be provided dynamically
        // from the getAllCategories method in the conceptRepo
    },
    {
        name: "subconcepts",
        label: "Subconcepts",
        type: "array",
        defaultValue: [],
        validation: {
            minLength: 0,
        },
        schema: [
            {
                name: "name",
                label: "Subconcept Name",
                type: "text",
                defaultValue: "",
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                },
            },
        ],
    },
];

export default conceptSchema;