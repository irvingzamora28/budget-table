import React from 'react';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="container mx-auto px-4">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 flex flex-col items-center ${
              activeTab === tab.id ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <tab.icon className="text-lg" />}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div>{/* Placeholder for the content rendering based on activeTab */}</div>
    </div>
  );
};

export default TabNavigation;
