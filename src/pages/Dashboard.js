// src/components/Dashboard.js
import React from "react";
import ActivityHistory from "../components/ActivitySection";

const Dashboard = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Expenses</h2>
                    <p>Total: $1,500</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Savings</h2>
                    <p>Total: $1,000</p>
                </div>
            </div>
            {/* <FormSection /> */}
            <ActivityHistory />
        </div>
    );
};

export default Dashboard;
