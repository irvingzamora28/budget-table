import React, { useState } from "react";
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

    const [activeTab, setActiveTab] = useState("overview"); // State for the active tab

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
                        <div className="grid grid-cols-1">
                            {/* Condensed Overview (No Add buttons, more compact layout) */}
                            <TableYear
                                title="Income"
                                year="2024"
                                initialData={income}
                                condensed={true}
                            />
                            <TableYear
                                title="Monthly Constant Expenses"
                                year="2024"
                                initialData={constantExpenses}
                                condensed={true}
                            />
                            <TableYear
                                title="No-Monthly Constant Expenses"
                                year="2024"
                                initialData={nonConstantExpenses}
                                condensed={true}
                            />
                            <TableYear
                                title="Savings Accounts"
                                year="2024"
                                initialData={savings}
                                condensed={true}
                            />
                            <TableYear
                                title="Investments"
                                year="2024"
                                initialData={investments}
                                condensed={true}
                            />
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
                    <>
                        <TableYear
                            title="Monthly Constant Expenses"
                            year="2024"
                            initialData={constantExpenses}
                        />
                        <TableYear
                            title="No-Monthly Constant Expenses"
                            year="2024"
                            initialData={nonConstantExpenses}
                        />
                    </>
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
