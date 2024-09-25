import React, { createContext, useContext, useState, useEffect } from "react";

let storage = localStorage;

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for a saved session when the app starts
        const savedUser = storage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        // Set user data and persist it
        setUser(userData);
        // Remove the password before storing
        const { password, ...userWithoutPassword } = userData;
        storage.setItem("user", JSON.stringify(userWithoutPassword));
    };

    const logout = () => {
        // Clear user data and remove it from storage
        setUser(null);
        storage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };