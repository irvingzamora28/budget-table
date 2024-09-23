import React, { useRef, useEffect, useState } from "react";
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
    const [maxHeight, setMaxHeight] = useState("0px");
    const sidebarRef = useRef(null);

    // Dynamically calculate the height for the sidebar in mobile view
    useEffect(() => {
        if (menuOpen) {
            setMaxHeight(`${sidebarRef.current.scrollHeight + 20}px`);
        } else {
            setMaxHeight("0px");
        }
    }, [menuOpen, menuItems, expandedMenuIds]); // Recalculate when submenus open

    return (
        <div className="flex flex-col md:flex-row">
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

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`bg-white shadow-md rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4 md:w-64 md:block transition-all duration-300 ease-in-out md:min-h-screen ${
                    menuOpen ? "p-4" : "p-0" // Remove padding when closed
                }`}
                style={{
                    maxHeight: menuOpen ? maxHeight : "0px", // Dynamic height for mobile dropdown
                    overflow: "hidden", // Hide overflowing content during transition
                    marginBottom: menuOpen ? "1rem" : "0", // Remove margin when closed
                    paddingBottom: menuOpen ? "1rem" : "0", // Remove padding when closed
                    paddingTop: menuOpen ? "1rem" : "0", // Remove padding when closed
                }}
            >
                <h2 className="text-xl font-bold mb-4 hidden md:block">
                    Settings
                </h2>
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
        </div>
    );
};

export default Sidebar;
