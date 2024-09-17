// src/components/Dashboard.js
import React from "react";
import ActivityHistory from "../components/ActivitySection";
import CardStat from "../components/CardStat";

const Dashboard = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardStat
                    title="Expenses"
                    value="5000"
                    percentage={20}
                    showProgressBar={true}
                />

                {/* Card with Percentage Change */}
                <CardStat
                    title="Savings"
                    value="545"
                    percentageChange={14}
                    showProgressBar={false}
                />
            </div>
            {/* <FormSection /> */}
            <ActivityHistory />
        </div>
    );
};

export default Dashboard;
