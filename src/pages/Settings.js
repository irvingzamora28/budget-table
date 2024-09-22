import React, { useState } from "react";
import GeneralSettings from "../components/settings/GeneralSettings";
import ConceptSettings from "../components/settings/ConceptSettings";
import CategorySettings from "../components/settings/CategorySettings";
import TagSettings from "../components/settings/TagSettings";
import Sidebar from "../components/misc/Sidebar";
import ContentPanel from "../components/settings/ContentPanel";

const SettingsComponent = () => {
    const [activeSection, setActiveSection] = useState("general");
    const [activeSubSection, setActiveSubSection] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [expandedMenuIds, setExpandedMenuIds] = useState([]);

    const menuItems = [
        { id: "general", label: "General Settings" },
        {
            id: "customData",
            label: "Custom Data",
            subItems: [
                { id: "categories", label: "Categories" },
                { id: "concepts", label: "Concepts" },
                { id: "tags", label: "Tags" },
            ],
        },
    ];

    const renderContent = () => {
        switch (activeSubSection || activeSection) {
            case "general":
                return <GeneralSettings />;
            case "categories":
                return <CategorySettings />;
            case "concepts":
                return <ConceptSettings />;
            case "tags":
                return <TagSettings />;
            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar
                menuItems={menuItems}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
                setActiveSection={setActiveSection}
                setActiveSubSection={setActiveSubSection}
                expandedMenuIds={expandedMenuIds}
                setExpandedMenuIds={setExpandedMenuIds}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />
            <ContentPanel>{renderContent()}</ContentPanel>
        </div>
    );
};

export default SettingsComponent;
