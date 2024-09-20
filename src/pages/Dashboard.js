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
import { userRepo } from "../database/dbAccessLayer"; 

const Dashboard = () => {
    // Data for constant expenses (existing)
    const constantExpenses = [
        {
            concept: "Rent",
            Jan: 1000,
            Feb: 1000,
            Mar: 1000,
            Apr: 1000,
            May: 1000,
            Jun: 1000,
            Jul: 1000,
            Aug: 1000,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Electricity",
            Jan: 150,
            Feb: 130,
            Mar: 140,
            Apr: 145,
            May: 150,
            Jun: 165,
            Jul: 170,
            Aug: 150,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Water",
            Jan: 50,
            Feb: 55,
            Mar: 60,
            Apr: 60,
            May: 65,
            Jun: 55,
            Jul: 55,
            Aug: 50,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
    ];

    // Data for income
    const income = [
        {
            concept: "Salary",
            Jan: 3000,
            Feb: 3000,
            Mar: 3200,
            Apr: 3100,
            May: 3000,
            Jun: 3200,
            Jul: 3100,
            Aug: 3300,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Freelancing",
            Jan: 500,
            Feb: 600,
            Mar: 450,
            Apr: 550,
            May: 500,
            Jun: 600,
            Jul: 550,
            Aug: 600,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
    ];

    // Data for non-constant expenses
    const nonConstantExpenses = [
        {
            concept: "Car Repair",
            Jan: "",
            Feb: 300,
            Mar: "",
            Apr: "",
            May: "",
            Jun: 200,
            Jul: "",
            Aug: "",
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Medical Bills",
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May: 100,
            Jun: "",
            Jul: "",
            Aug: 250,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
    ];

    // Data for savings
    const savings = [
        {
            concept: "Emergency Fund",
            Jan: 500,
            Feb: 600,
            Mar: 550,
            Apr: 600,
            May: 650,
            Jun: 600,
            Jul: 700,
            Aug: 750,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Vacation Fund",
            Jan: 100,
            Feb: 150,
            Mar: 120,
            Apr: 130,
            May: 200,
            Jun: 180,
            Jul: 160,
            Aug: 190,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
    ];

    // Data for investments
    const investments = [
        {
            concept: "Stocks",
            Jan: 1000,
            Feb: 1200,
            Mar: 1100,
            Apr: 1150,
            May: 1200,
            Jun: 1250,
            Jul: 1300,
            Aug: 1400,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
        {
            concept: "Real Estate",
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: 5000,
            May: "",
            Jun: "",
            Jul: "",
            Aug: 5000,
            Sep: "",
            Oct: "",
            Nov: "",
            Dec: "",
        },
    ];
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("overview"); // State for the active tab
    const [selectedMonth, setSelectedMonth] = useState(null);

    const handleMonthClick = (month) => {
        setSelectedMonth(month);
    };

    useEffect(() => {
        const addAndFetchUsers = async () => {
            // Add a test user
            await userRepo.add({ username: "John Doe", email: "john@example.com", password: "password123" });

            // Fetch all users
            const fetchedUsers = await userRepo.getAll(); 
            setUsers(fetchedUsers);
        };

        addAndFetchUsers();
    }, []);

    // Define the tabs you want to show, including their icons and labels
    const tabs = [
        { id: "overview", label: "Overview", icon: FaHome },
        { id: "income", label: "Income", icon: FaMoneyBill },
        { id: "expenses", label: "Expenses", icon: FaWallet },
        { id: "savings", label: "Savings Accounts", icon: FaPiggyBank },
        { id: "investments", label: "Investments", icon: FaChartLine },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <>
                        <div className="text-2xl font-bold mb-4 text-center">
                            Budget overview 2024
                        </div>
                        <div className="flex flex-col lg:flex-row">

                            {/* User Table */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Users</h2>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">ID</th>
                                        <th className="border px-4 py-2">Username</th>
                                        <th className="border px-4 py-2">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="border px-4 py-2">{user.id}</td>
                                            <td className="border px-4 py-2">{user.username}</td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                            {/* The two TableYear components will stack on top of each other on small screens */}
                            <div
                                className={`w-full ${
                                    selectedMonth ? "lg:w-[70%]" : ""
                                } pr-0 lg:pr-4 order-2 lg:order-1`}
                            >
                                <TableYear
                                    title="Income"
                                    year="2024"
                                    initialData={income}
                                    onMonthClick={handleMonthClick}
                                    condensed={true}
                                />
                                <TableYear
                                    title="Monthly Constant Expenses"
                                    year="2024"
                                    initialData={constantExpenses}
                                    condensed={true}
                                    showHeader={false}
                                />
                                <TableYear
                                    title="No-Monthly Constant Expenses"
                                    year="2024"
                                    initialData={nonConstantExpenses}
                                    condensed={true}
                                    showHeader={false}
                                />
                                <TableYear
                                    title="Savings Accounts"
                                    year="2024"
                                    initialData={savings}
                                    condensed={true}
                                    showHeader={false}
                                />
                                <TableYear
                                    title="Investments"
                                    year="2024"
                                    initialData={investments}
                                    condensed={true}
                                    showHeader={false}
                                />
                            </div>

                            {/* ExpenseDetailTable will appear first on small screens and to the right on large screens */}
                            {selectedMonth && (
                                <div className="w-full lg:w-[30%] mt-4 lg:mt-0 order-1 lg:order-2">
                                    <ExpenseDetailTable month={selectedMonth} condensed={true} />
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
                    <TableYear
                        title="Income"
                        year="2024"
                        initialData={income}
                    />
                );
            case "expenses":
                return (
                    <div className="flex flex-col lg:flex-row">
                        {/* The two TableYear components will stack on top of each other on small screens */}
                        <div
                            className={`w-full ${
                                selectedMonth ? "lg:w-[70%]" : ""
                            } pr-0 lg:pr-4 order-2 lg:order-1`}
                        >
                            <TableYear
                                title="Monthly Constant Expenses"
                                year="2024"
                                initialData={constantExpenses}
                                onMonthClick={handleMonthClick}
                            />
                            <TableYear
                                title="Non-Monthly Constant Expenses"
                                year="2024"
                                initialData={nonConstantExpenses}
                                onMonthClick={handleMonthClick}
                            />
                        </div>

                        {/* ExpenseDetailTable will appear first on small screens and to the right on large screens */}
                        {selectedMonth && (
                            <div className="w-full lg:w-[30%] mt-4 lg:mt-0 order-1 lg:order-2">
                                <ExpenseDetailTable month={selectedMonth} />
                            </div>
                        )}
                    </div>
                );

            case "savings":
                return (
                    <TableYear
                        title="Savings Accounts"
                        year="2024"
                        initialData={savings}
                    />
                );
            case "investments":
                return (
                    <TableYear
                        title="Investments"
                        year="2024"
                        initialData={investments}
                    />
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
