import React from "react";

const MenuItem = ({
    item,
    activeSection,
    activeSubSection,
    setActiveSection,
    setActiveSubSection,
    expandedMenuIds,
    setExpandedMenuIds,
    setMenuOpen,
}) => {
    const isExpanded = expandedMenuIds.includes(item.id);

    const handleClick = () => {
        if (item.subItems) {
            if (isExpanded) {
                setExpandedMenuIds(
                    expandedMenuIds.filter((id) => id !== item.id)
                );
            } else {
                setExpandedMenuIds([...expandedMenuIds, item.id]);
            }
        } else {
            setActiveSection(item.id);
            setActiveSubSection(null);
            setMenuOpen(false); // Close the menu when an item is selected
        }
    };

    return (
        <>
            <li
                className={`flex items-center justify-between cursor-pointer p-2 rounded-md mb-2 transition-colors ${
                    activeSection === item.id && !activeSubSection
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                }`}
                onClick={handleClick}
            >
                <span>{item.label}</span>
                {item.subItems && (
                    <svg
                        className={`w-4 h-4 transform transition-transform ${
                            isExpanded ? "rotate-90" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </li>

            {item.subItems && isExpanded && (
                <ul className="ml-4">
                    {item.subItems.map((subItem) => (
                        <li
                            key={subItem.id}
                            className={`cursor-pointer p-2 rounded-md mb-2 transition-colors ${
                                activeSection === item.id &&
                                activeSubSection === subItem.id
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                                setActiveSection(item.id);
                                setActiveSubSection(subItem.id);
                                setMenuOpen(false); // Close the menu when a sub-item is selected
                            }}
                        >
                            {subItem.label}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default MenuItem;
