import React, { useState } from "react";

const SettingsComponent = () => {
    const [activeSection, setActiveSection] = useState("general");
    const [menuOpen, setMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeSection) {
            case "general":
                return <GeneralSettings />;
            case "customData":
                return <CustomDataSettings />;
            default:
                return <div>Select a section</div>;
        }
    };

    const menuItems = [
        { id: "general", label: "General Settings" },
        { id: "customData", label: "Custom Data" },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Mobile Menu Button */}
            <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-md">
                <h2 className="text-xl font-bold">Settings</h2>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Side Menu */}
            <div
                className={`bg-white shadow-md rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4 md:w-64 md:block ${
                    menuOpen ? "block" : "hidden"
                }`}
            >
                <h2 className="text-xl font-bold mb-4 hidden md:block">
                    Settings
                </h2>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={`cursor-pointer p-2 rounded-md mb-2 transition-colors ${
                                activeSection === item.id
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                                setActiveSection(item.id);
                                setMenuOpen(false);
                            }}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content Panel */}
            <div className="flex-1 py-6 px-0 md:py-0 md:px-6">
                {renderContent()}
            </div>
        </div>
    );
};

const GeneralSettings = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        notifications: true,
        darkMode: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSave = () => {
        alert("Settings saved!");
        // You can add API calls here to save settings to the server.
    };
    
    return (
        <div>
            {/* Profile Information Section */}
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4">General Settings</h2>

                {/* Profile Information Section */}
                <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Profile Information
                    </h2>
                    <div className="mb-4">
                        <label
                            className="block font-semibold mb-2"
                            htmlFor="name"
                        >
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block font-semibold mb-2"
                            htmlFor="email"
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </section>

                {/* Notification Settings Section */}
                <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Notifications
                    </h2>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={profile.notifications}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Enable email notifications
                        </label>
                    </div>
                </section>

                {/* Account Settings Section */}
                <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Account Settings
                    </h2>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="darkMode"
                                checked={profile.darkMode}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Enable dark mode
                        </label>
                    </div>
                </section>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md float-end hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

const CustomDataSettings = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Custom Data</h2>
        {/* Add your custom data management UI here */}
        <p>Custom data management content goes here...</p>
    </div>
);

export default SettingsComponent;
