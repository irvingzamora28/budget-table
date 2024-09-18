import React, { useState } from "react";
import TableYear from "../components/TableYear";
import CardStat from "../components/CardStat";

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

        const [activeTab, setActiveTab] = useState('overview'); // Manage active tab state
      
        const renderContent = () => {
          switch (activeTab) {
            case 'overview':
              return (
                <>
                {/* Card Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 gap-4">
                  {/* Condensed Overview (No Add buttons, more compact layout) */}
                  <TableYear title="Income" year="2024" initialData={income} condensed={true} />
                  <TableYear title="Monthly Constant Expenses" year="2024" initialData={constantExpenses} condensed={true} />
                  <TableYear title="No-Monthly Constant Expenses" year="2024" initialData={nonConstantExpenses} condensed={true} />
                  <TableYear title="Savings Accounts" year="2024" initialData={savings} condensed={true} />
                  <TableYear title="Investments" year="2024" initialData={investments} condensed={true} />
                </div>
                </>
              );
            case 'income':
              return <TableYear title="Income" year="2024" initialData={income} />;
            case 'expenses':
              return (
                <>
                  <TableYear title="Monthly Constant Expenses" year="2024" initialData={constantExpenses} />
                  <TableYear title="No-Monthly Constant Expenses" year="2024" initialData={nonConstantExpenses} />
                </>
              );
            case 'savings':
              return <TableYear title="Savings Accounts" year="2024" initialData={savings} />;
            case 'investments':
              return <TableYear title="Investments" year="2024" initialData={investments} />;
            default:
              return null;
          }
        };
      
        return (
          <div className="container mx-auto px-4 pb-16">
            {/* Tab Navigation */}
            <div className="flex justify-around border-b mb-4">
              <button
                className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'income' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('income')}
              >
                Income
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'expenses' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('expenses')}
              >
                Expenses
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'savings' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('savings')}
              >
                Savings Accounts
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'investments' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('investments')}
              >
                Investments
              </button>
            </div>
      
            {/* Tab Content */}
            {renderContent()}
          </div>
        );
      };
      
export default Dashboard;
