import React from 'react';
import { FaHome, FaMoneyBill, FaWallet, FaPiggyBank, FaChartLine } from 'react-icons/fa'; // Import icons

// Reusable TabNavigation component
const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id} // Use unique id or label
            className={`px-4 py-2 flex flex-col items-center ${
              activeTab === tab.id ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <tab.icon className="text-lg" />} {/* Render the icon */}
            <span className="hidden sm:inline">{tab.label}</span> {/* Render the label */}
          </button>
        ))}
      </div>

      {/* Placeholder for the content rendering based on activeTab */}
      <div>{/* You will need to control what content to display here */}</div>
    </div>
  );
};

export default TabNavigation;
