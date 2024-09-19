import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing an icon from react-icons
import logo from "../assets/images/logo_budget_table_removebg.png";

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);

    // Function to toggle the menu
    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    // Function to close the menu when clicking outside
    const closeMenu = () => {
        setShowMenu(false);
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <nav className="container mx-auto flex justify-between items-center px-8">
                {/* Logo and Title */}
                <div className="flex items-center space-x-2">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Budget Table Logo"
                            className="h-8 w-full"
                        />
                    </Link>
                </div>

                {/* Right Section with Icons and User Info */}
                <div className="flex items-center space-x-6">
                    <button className="relative">
                        <i className="fas fa-envelope text-gray-500"></i>
                    </button>
                    <button className="relative">
                        <i className="fas fa-bell text-gray-500"></i>
                    </button>

                    {/* User info with dropdown */}
                    <div className="relative flex items-center space-x-2">
                        {/* User Name and Role */}
                        <div>
                            <span className="block font-bold">John Doe</span>
                        </div>

                        {/* Icon next to the user name (clickable to show menu) */}
                        <button
                            onClick={toggleMenu}
                            className="focus:outline-none"
                        >
                            <FaUserCircle className="text-2xl text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div
                                className="absolute top-12 right-0 bg-white shadow-md rounded-lg w-40 z-10"
                                onClick={closeMenu} // Close menu on clicking outside
                            >
                                <ul className="py-2">
                                    <Link to="/">
                                        <li className="px-4 py-2 hover:bg-gray-100">
                                            Dashboard
                                        </li>
                                    </Link>
                                    <Link to="/settings">
                                        <li className="px-4 py-2 hover:bg-gray-100">
                                            Settings
                                        </li>
                                    </Link>
                                    <li className="px-4 py-2 hover:bg-gray-100">
                                        <button
                                            onClick={() => alert("Logging out")}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
