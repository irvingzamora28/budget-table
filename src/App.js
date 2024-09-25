import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/route/PublicRoute";
import PrivateRoute from "./components/route/PrivateRoute";

// Determine basename dynamically based on the environment
const basename = process.env.NODE_ENV === "production" ? "/budget-table" : "/";

function App() {
    return (
        <AuthProvider>
            <Router basename={"/budget-table"}>
                <Routes>
                    {/* Public Routes with redirection for authenticated users */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <SignIn />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Private Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                    </Route>

                    {/* Settings Route Directly */}
                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
