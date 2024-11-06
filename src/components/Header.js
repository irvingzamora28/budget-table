import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/images/logo_budget_table_removebg.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const { logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleMenuItemClick = (path) => {
        setShowMenu(false);
        navigate(path);
    };

    const handleLogout = () => {
        setShowMenu(false);
        logout();
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <nav className="mx-auto flex justify-between items-center px-8">
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
                    <div className="relative flex items-center space-x-2" ref={dropdownRef}>
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
                            <div className="absolute top-12 right-0 bg-white shadow-md rounded-lg w-40 z-10">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuItemClick("/")}>
                                        Dashboard
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuItemClick("/settings")}>
                                        Settings
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                        Logout
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