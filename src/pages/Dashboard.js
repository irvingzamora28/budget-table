// src/components/Dashboard.js
import React from "react";
import TableYear from "../components/TableYear";
import CardStat from "../components/CardStat";

const Dashboard = () => {

    const data = [
        { concept: 'Rent', Jan: 1000, Feb: 1000, Mar: 1000, Apr: 1000, May: 1000, Jun: 1000, Jul: 1000, Aug: 1000, Sep: '', Oct: '', Nov: '', Dec: '' },
        { concept: 'Electricity', Jan: 150, Feb: 130, Mar: 140, Apr: 145, May: 150, Jun: 165, Jul: 170, Aug: 150, Sep: '', Oct: '', Nov: '', Dec: '' },
        { concept: 'Water', Jan: 50, Feb: 55, Mar: 60, Apr: 60, May: 65, Jun: 55, Jul: 55, Aug: 50, Sep: '', Oct: '', Nov: '', Dec: '' },
      ];

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardStat
                    title="Expenses"
                    value="5000"
                    percentage={20}
                    showProgressBar={true}
                    topRightText="September"
                />

                {/* Card with Percentage Change */}
                <CardStat
                    title="Savings"
                    value="545"
                    percentageChange={14}
                    showProgressBar={false}
                    topRightText="September"
                />
            </div>
            <TableYear title="Constant Expenses" year="2024" initialData={data} />
        </div>
    );
};

export default Dashboard;
