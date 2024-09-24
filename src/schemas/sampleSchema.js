const sampleSchema = [
    {name: "name", label: "Name", type: "text", defaultValue: ""},
    {name: "description", label: "Description", type: "textarea", defaultValue: ""},
    {name: "color", label: "Color", type: "color", defaultValue: "#000000"},
    {name: "isActive", label: "Is Active", type: "checkbox", defaultValue: false},
    {name: "date", label: "Date", type: "date", defaultValue: ""},
    {name: "time", label: "Time", type: "time", defaultValue: ""},
    {name: "datetime", label: "Date and Time", type: "datetime-local", defaultValue: ""},
    {name: "quantity", label: "Quantity", type: "number", defaultValue: ""},
    {name: "price", label: "Price", type: "number", defaultValue: ""},
    {name: "email", label: "Email", type: "email", defaultValue: ""},
    {name: "phone", label: "Phone", type: "tel", defaultValue: ""},
    {name: "url", label: "URL", type: "url", defaultValue: ""},
    {name: "file", label: "File", type: "file", defaultValue: ""},
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
    },
    {name: "rating", label: "Rating", type: "range", defaultValue: ""},
]

export default sampleSchema;