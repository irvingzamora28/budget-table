import React from "react";
import MenuItem from "./MenuItem";

const Sidebar = ({
    menuItems,
    activeSection,
    activeSubSection,
    setActiveSection,
    setActiveSubSection,
    expandedMenuIds,
    setExpandedMenuIds,
    menuOpen,
    setMenuOpen,
}) => {
    return (
        <div
            className={`bg-white shadow-md rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4 md:w-64 md:block ${
                menuOpen ? "block" : "hidden"
            }`}
        >
            <h2 className="text-xl font-bold mb-4 hidden md:block">Settings</h2>
            <ul>
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        item={item}
                        activeSection={activeSection}
                        activeSubSection={activeSubSection}
                        setActiveSection={setActiveSection}
                        setActiveSubSection={setActiveSubSection}
                        expandedMenuIds={expandedMenuIds}
                        setExpandedMenuIds={setExpandedMenuIds}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
