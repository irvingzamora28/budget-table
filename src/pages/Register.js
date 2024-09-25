import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/images/logo_budget_table_removebg.png";
import { userRepo } from "../database/dbAccessLayer";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
        } else {
            try {
                // Hash the password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);

                // Add the user to the database
                const userId = await userRepo.add({
                    username,
                    email,
                    password: hashedPassword,
                });
                login({id: userId.id, username, email, password: hashedPassword });
                navigate("/dashboard"); // Redirect to dashboard after successful registration
            } catch (error) {
                setError(
                    "An error occurred while registering. Please try again."
                );
                console.error("Registration error:", error);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 m-4 max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Budget Table Logo" className="h-16" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            autoFocus={true}
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm your password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-500 hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
