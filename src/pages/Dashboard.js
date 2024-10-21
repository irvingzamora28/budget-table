import React, { useState, useEffect } from "react";
import TableYear from "../components/TableYear";
import CardStat from "../components/CardStat";
import {
    FaHome,
    FaMoneyBill,
    FaWallet,
    FaPiggyBank,
    FaChartLine,
} from "react-icons/fa";
import TabNavigation from "../components/TabNavigation";
import ExpenseDetailTable from "../components/ExpenseDetailTable";
import UnifiedTableYear from "../components/UnifiedTableYear";
import { categoryRepo } from "../database/dbAccessLayer";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state

    const handleMonthClick = (month) => {
        setSelectedMonth(month);
    };

    const handleCloseExpenseDetailTable = () => {
        setSelectedMonth(null);
    };

    // Fetch categories and financials data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories =
                    await categoryRepo.getFinancialsByCategories();
                setCategories(allCategories); // Populate categories once fetched
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchCategories();
    }, []);

    // Convert categories data into sections format expected by UnifiedTableYear
    const sections = categories.map((category) => ({
        id: category.category.id,
        title: category.category.name,
        type: category.category.type,
        data:
            category.category.income ||
            category.category.expenses ||
            category.category.savings ||
            category.category.investments ||
            [],
    }));

    // Define the tabs you want to show, including their icons and labels
    const tabs = [
        { id: "overview", label: "Overview", icon: FaHome },
        { id: "income", label: "Income", icon: FaMoneyBill },
        { id: "expenses", label: "Expenses", icon: FaWallet },
        { id: "savings", label: "Savings Accounts", icon: FaPiggyBank },
        { id: "investments", label: "Investments", icon: FaChartLine },
    ];

    const renderContent = () => {
        // Show a loading state while data is being fetched
        if (loading) {
            return <div className="text-center">Loading data...</div>;
        }

        // If no categories are found
        if (!sections.length) {
            return <div className="text-center">No data available</div>;
        }

        switch (activeTab) {
            case "overview":
                return (
                    <>
                        <div className="text-2xl font-bold mb-4 text-center">
                            Budget overview 2024
                        </div>
                        <div className="flex flex-col lg:flex-row">
                            <div
                                className={`w-full ${
                                    selectedMonth ? "lg:w-[70%]" : ""
                                } pr-0 lg:pr-4 order-2 lg:order-1`}
                            >
                                <UnifiedTableYear
                                    sections={sections}
                                    year="2024"
                                    onMonthClick={handleMonthClick}
                                    condensed={true}
                                />
                            </div>

                            {selectedMonth && (
                                <div className="w-full lg:w-[30%] mt-4 lg:mt-0 order-1 lg:order-2">
                                    <ExpenseDetailTable
                                        month={selectedMonth}
                                        onCloseExpenseDetailTable={
                                            handleCloseExpenseDetailTable
                                        }
                                        condensed={true}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Card Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                            <CardStat
                                title="Expenses"
                                value="500"
                                percentage={20}
                                showProgressBar={true}
                                topRightText="September"
                            />
                            <CardStat
                                title="Savings"
                                value="545"
                                percentageChange={14}
                                showProgressBar={false}
                                topRightText="September"
                            />
                        </div>
                    </>
                );
            case "income":
                return (
                    <>
                        {sections
                            .filter((section) => section.type === "INCOME")
                            .map((section) => (
                                <TableYear
                                    title={section.title}
                                    year="2024"
                                    initialData={section.data || []}
                                />
                            ))}
                    </>
                );

            case "expenses":
                return (
                    <div className="flex flex-col lg:flex-row">
                        <div
                            className={`w-full ${
                                selectedMonth ? "lg:w-[70%]" : ""
                            } pr-0 lg:pr-4 order-2 lg:order-1`}
                        >
                            <>
                                {sections
                                    .filter(
                                        (section) => section.type === "EXPENSE"
                                    )
                                    .map((section) => (
                                        <TableYear
                                            title={section.title}
                                            year="2024"
                                            initialData={section.data || []}
                                            onMonthClick={handleMonthClick}
                                        />
                                    ))}
                            </>
                        </div>

                        {selectedMonth && (
                            <div className="w-full lg:w-[30%] mt-4 lg:mt-0 order-1 lg:order-2">
                                <ExpenseDetailTable month={selectedMonth} />
                            </div>
                        )}
                    </div>
                );
            case "savings":
                return (
                    <>
                        {sections
                            .filter((section) => section.type === "SAVING")
                            .map((section) => (
                                <TableYear
                                    title={section.title}
                                    year="2024"
                                    initialData={section.data || []}
                                />
                            ))}
                    </>
                );
            case "investments":
                return (
                    <>
                        {sections
                            .filter((section) => section.type === "INVESTMENT")
                            .map((section) => (
                                <TableYear
                                    title={section.title}
                                    year="2024"
                                    initialData={section.data || []}
                                />
                            ))}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 pb-16">
            {/* Tab Navigation */}
            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Tab Content */}
            {renderContent()}
        </div>
    );
};

export default Dashboard;
