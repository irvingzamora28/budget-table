import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings"; // Import the Settings page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
