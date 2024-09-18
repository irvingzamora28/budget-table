// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="bg-slate-100">
            <Header />
            <main className="container mx-auto px-4 py-6 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
