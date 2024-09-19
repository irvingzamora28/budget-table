import React from 'react';

const ExpenseDetailTable = ({ month, condensed = false }) => {
  // Dummy data for the detail table
  const dummyData = [
    { concept: 'Groceries', detail: 'Weekly shopping', amount: 120 },
    { concept: 'Utilities', detail: 'Electricity bill', amount: 80 },
    { concept: 'Transportation', detail: 'Gas', amount: 50 },
  ];

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${condensed ? 'mb-6' : 'my-6'}`}>
      <h3 className="text-lg font-semibold mb-4">Expense Details - {month}</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Concept</th>
            <th className="text-left py-2">Detail</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-2">{item.concept}</td>
              <td className="py-2">{item.detail}</td>
              <td className="py-2 text-right">${item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseDetailTable;