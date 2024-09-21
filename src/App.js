import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings"; // Import the Settings page
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";

function App() {
    return (
        <Router>
            <Routes>
                    {/* No Layout for SignIn and Register pages */}
                <Route path="/" element={<SignIn />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard uses the Layout wrapper */}
                <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
