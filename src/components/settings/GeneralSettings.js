import React, { useState } from "react";

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
                <h2 className="text-lg font-semibold mb-4">Notifications</h2>
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
    );
};

export default GeneralSettings;
