import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/images/logo_budget_table_removebg.png";
import { userRepo } from "../database/dbAccessLayer";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const user = await userRepo.getByEmail(email);
            if (user) {
                // Check if the password matches the hashed password in the database
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    // Set up session or token here (to implement later)
                    navigate("/dashboard");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                setError("User not found");
            }
        } catch (error) {
            setError("An error occurred during login. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Budget Table Logo" className="h-16" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-500 hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
