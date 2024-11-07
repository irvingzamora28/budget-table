import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { expenseRepo, categoryRepo, conceptRepo } from "../database/dbAccessLayer"; // Adjust the path as necessary
import AddExpenseModal from "./AddExpenseModal"; // Adjust the path as necessary

const ExpenseDetailTable = ({
    month,
    userId, // Assuming you need to filter by user
    budgetId, // Assuming you need to filter by budget
    onCloseExpenseDetailTable,
    condensed = false,
}) => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState({});
    const [conceptsMap, setConceptsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Fetch expenses, categories, and concepts on component mount or when dependencies change
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Adjusted Query
                const query = {
                    date: { $like: `${month}%` },
                    user_id: userId,
                    budget_id: budgetId,
                };

                const fetchedExpenses = await expenseRepo.getAll(query);

                // Fetch all categories to map category_id to category name
                const fetchedCategories = await categoryRepo.getAll();
                const categoryMap = {};
                fetchedCategories.forEach((category) => {
                    categoryMap[category.id] = category.name; // Adjust 'name' if your category has a different field
                });

                // Fetch all concepts to map concept_id to concept name
                const fetchedConcepts = await conceptRepo.getAll();
                const conceptMap = {};
                fetchedConcepts.forEach((concept) => {
                    conceptMap[concept.id] = concept.name;
                });

                setCategories(categoryMap);
                setConceptsMap(conceptMap);
                setExpenses(fetchedExpenses);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load expenses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month, userId, budgetId]);

    // Handle adding a new expense
    const handleAddExpense = async (addedExpense) => {
        try {
            const fetchedExpense = await expenseRepo.getById(addedExpense.id);
            if (fetchedExpense) {
                // Check if the expense's date matches the selected month
                if (fetchedExpense.date.startsWith(month)) {
                    setExpenses((prevExpenses) => [...prevExpenses, fetchedExpense]);
                } else {
                    console.log(
                        `Expense with ID ${fetchedExpense.id} does not match the selected month (${month}). Not appending.`
                    );
                }
            } else {
                // If not able to fetch, optionally re-fetch all expenses
                console.warn("Added expense not found");
            }
        } catch (err) {
            console.error("Failed to fetch the added expense:", err);
            // Optionally, show error to user
        }
    };

    return (
        <div className={`relative bg-white shadow-md rounded-lg p-4 ${condensed ? "mb-6" : "my-6"} pb-16`}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Expense Details - {month}
                    </h3>
                    {!loading && !error && (
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
                        </p>
                    )}
                </div>
                {/* Close Expense Detail Table */}
                <button
                    onClick={onCloseExpenseDetailTable}
                    className="text-gray-500 hover:text-gray-700"
                    title="Close"
                >
                    <FaTimes size={20} />
                </button>
            </div>

            {/* Content Section */}
            {loading ? (
                <p>Loading expenses...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    {expenses.length === 0 ? (
                        <p>No expenses found for this period.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Category</th>
                                        <th className="text-left py-2">Concept</th>
                                        <th className="text-left py-2">Detail</th>
                                        <th className="text-right py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2">
                                                {categories[expense.category_id] ||
                                                    "Unknown"}
                                            </td>
                                            <td className="py-2">
                                                {conceptsMap[expense.concept_id] ||
                                                    "N/A"}
                                            </td>
                                            <td className="py-2">
                                                {expense.detail || "N/A"}
                                            </td>
                                            <td className="py-2 text-right">
                                                ${expense.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2 font-semibold">
                                        <td colSpan="3" className="py-2 text-right">
                                            Total:
                                        </td>
                                        <td className="py-2 text-right">
                                            ${totalExpenses.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setShowAddExpenseModal(true)}
                className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform duration-200 transform hover:scale-110 flex items-center justify-center"
                title="Add Expense"
                aria-label="Add Expense"
            >
                <FaPlus size={16} />
            </button>

            {/* Add Expense Modal */}
            <AddExpenseModal
                showModal={showAddExpenseModal}
                setShowModal={setShowAddExpenseModal}
                handleAddExpense={handleAddExpense}
                userId={userId}
                budgetId={budgetId}
            />
        </div>
    );
};

export default ExpenseDetailTable;