const sampleSchema = [
    {
        name: "name",
        label: "Name",
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
            maxLength: 500,
        },
    },
    {
        name: "color",
        label: "Color",
        type: "color",
        defaultValue: "#000000",
        validation: {
            required: true,
            pattern: /^#[0-9A-Fa-f]{6}$/,
        },
    },
    {
        name: "isActive",
        label: "Is Active",
        type: "checkbox",
        defaultValue: false,
    },
    {
        name: "gender",
        label: "Gender",
        type: "radio",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
        ],
        validation: {
            required: true,
        },
    },
    {
        name: "date",
        label: "Date",
        type: "date",
        defaultValue: "",
        validation: {
            required: true,
        },
    },
    {
        name: "time",
        label: "Time",
        type: "time",
        defaultValue: "",
        validation: {
            required: true,
        },
    },
    {
        name: "datetime",
        label: "Date and Time",
        type: "datetime-local",
        defaultValue: "",
        validation: {
            required: true,
        },
    },
    {
        name: "quantity",
        label: "Quantity",
        type: "number",
        defaultValue: "",
        validation: {
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        name: "price",
        label: "Price",
        type: "number",
        defaultValue: "",
        validation: {
            required: true,
            min: 0,
            step: 0.01,
        },
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        defaultValue: "",
        validation: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
    },
    {
        name: "phone",
        label: "Phone",
        type: "tel",
        defaultValue: "",
        validation: {
            required: true,
            pattern: /^\+?[1-9]\d{1,14}$/,
        },
    },
    {
        name: "url",
        label: "URL",
        type: "url",
        defaultValue: "",
        validation: {
            required: true,
            pattern:
                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        },
    },
    {
        name: "file",
        label: "File",
        type: "file",
        defaultValue: "",
        validation: {
            required: true,
            acceptedFileTypes: [".pdf", ".doc", ".docx", ".txt"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
        },
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
            { value: "OFFLINE", label: "Offline" },
        ],
        defaultValue: "ACTIVE",
        validation: {
            required: true,
        },
    },
    {
        name: "rating",
        label: "Rating",
        type: "range",
        defaultValue: "5",
        validation: {
            required: true,
            min: 1,
            max: 10,
            step: 1,
        },
    },
];

export default sampleSchema;
