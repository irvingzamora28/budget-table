// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo_budget_table_removebg.png";

const Header = () => {
    return (
        <header className="bg-white shadow-sm py-4">
            <nav className="container mx-auto flex justify-between items-center px-8">
                {/* Logo and Title */}
                <div className="flex items-center space-x-2">
                    <img
                        src={logo}
                        alt="Budget Table Logo"
                        className="h-8 w-full"
                    />
                </div>

                {/* Right Section with Icons and User Info */}
                <div className="flex items-center space-x-6">
                    <button className="relative">
                        <i className="fas fa-envelope text-gray-500"></i>
                    </button>
                    <button className="relative">
                        <i className="fas fa-bell text-gray-500"></i>
                    </button>
                    <div className="flex items-center space-x-2">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User"
                            className="rounded-full w-10 h-10"
                        />
                        <div>
                            <span className="block font-bold">John Doe</span>
                            <span className="text-gray-500 text-sm">
                                User
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
