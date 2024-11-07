// src/components/AddExpenseModal.js

import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { conceptRepo, expenseRepo, categoryRepo } from "../database/dbAccessLayer";

const AddExpenseModal = ({
    showModal,
    setShowModal,
    handleAddExpense,
    userId,
    budgetId,
}) => {
    const [concepts, setConcepts] = useState([]);
    const [selectedConceptId, setSelectedConceptId] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [detail, setDetail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const conceptSelectRef = useRef(null);
    const categorySelectRef = useRef(null);
    const dateInputRef = useRef(null);

    // Function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch concepts and categories, set today's date when the modal is opened
    useEffect(() => {
        if (showModal) {
            fetchConcepts();
            fetchCategories();
            setDate(getTodayDate()); // Set today's date
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            // Reset form when modal is closed
            resetForm();
            document.body.style.overflow = 'auto'; // Restore background scroll
        }
    }, [showModal]);

    const fetchConcepts = async () => {
        try {
            const fetchedConcepts = await conceptRepo.getAll();
            setConcepts(fetchedConcepts);
            if (fetchedConcepts.length > 0) {
                setSelectedConceptId(fetchedConcepts[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch concepts:", err);
            setError("Failed to load concepts.");
        }
    };

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await categoryRepo.getAll();
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0) {
                setSelectedCategoryId(fetchedCategories[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError("Failed to load categories.");
        }
    };

    const resetForm = () => {
        if (concepts.length > 0) {
            setSelectedConceptId(concepts[0].id);
        } else {
            setSelectedConceptId("");
        }
        if (categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        } else {
            setSelectedCategoryId("");
        }
        setDate(getTodayDate());
        setAmount("");
        setDetail("");
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedConceptId || !selectedCategoryId || !date || !amount || !detail) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newExpense = {
                user_id: userId,
                budget_id: budgetId,
                category_id: selectedCategoryId, // Use selectedCategoryId
                concept_id: selectedConceptId,
                subconcept_id: null, // Ignored for now
                amount: parseFloat(amount),
                date,
                detail,
                is_constant: false, // Default value
            };

            const addedExpense = await expenseRepo.add(newExpense);
            handleAddExpense(addedExpense); // Notify parent to refresh
            setShowModal(false);
            // Reset form
            resetForm();
        } catch (err) {
            console.error("Failed to add expense:", err);
            setError("Failed to add expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle closing the modal with the Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowModal(false);
            }
        };

        if (showModal) {
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal, setShowModal]);

    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)} // Close modal when clicking outside
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 md:w-1/3 z-60"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Add New Expense</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close Modal"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Concept Selection */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Concept</label>
                        <select
                            value={selectedConceptId}
                            onChange={(e) => setSelectedConceptId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            ref={conceptSelectRef}
                            required
                        >
                            <option value="" disabled>
                                Select a concept
                            </option>
                            {concepts.map((concept) => (
                                <option key={concept.id} value={concept.id}>
                                    {concept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Category Selection */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            ref={categorySelectRef}
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Date Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                            ref={dateInputRef}
                        />
                    </div>
                    {/* Amount Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                    {/* Detail Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Detail</label>
                        <textarea
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                            placeholder="Enter expense details"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                            disabled={loading}
                        >
                            <FaPlus className="mr-2" />
                            {loading ? "Adding..." : "Add Expense"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )};

export default AddExpenseModal;
