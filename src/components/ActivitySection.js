// src/components/ActivityHistory.js
import React from 'react';

const ActivityHistory = () => {
  const transactions = [
    { type: 'Buy Order', sender: 'gdh-34um3bbj', id: 'HJD9R034JNN3N43', time: '10:23:45', status: 'Completed', amount: '+0,041BTC' },
    { type: 'Buy Order', sender: 'gdh-34um3bbj', id: 'HJD9R034JNN3N43', time: '10:23:45', status: 'Completed', amount: '+0,041BTC' },
    { type: 'Exchange Order', sender: 'gdh-34um3bbj', id: 'HJD9R034JNN3N43', time: '10:23:45', status: 'Completed', amount: '+0,041BTC' },
    { type: 'Sell Order', sender: 'gdh-34um3bbj', id: 'HJD9R034JNN3N43', time: '10:23:45', status: 'Completed', amount: '+0,041BTC' },
    // Add more transactions as needed
  ];

  return (
    <section className="bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-2xl font-bold mb-6">Activities History</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Crypto Orders</th>
            <th className="px-4 py-2 text-left font-medium">Sender ID</th>
            <th className="px-4 py-2 text-left font-medium">Transaction ID</th>
            <th className="px-4 py-2 text-left font-medium">Time</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {transactions.map((tx, index) => (
            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">{tx.type}</td>
              <td className="px-4 py-3">{tx.sender}</td>
              <td className="px-4 py-3">{tx.id}</td>
              <td className="px-4 py-3">{tx.time}</td>
              <td className="px-4 py-3">
                <span className="text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs">
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-3">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ActivityHistory;
