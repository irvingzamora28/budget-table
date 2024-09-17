// src/components/CardStat.js
import React from 'react';

const CardStat = ({ title, value, percentage, showProgressBar, percentageChange }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-end relative">
      <div>
        {/* Title */}
        <h2 className="text-md font-semibold text-gray-500">{title}</h2>
        
        {/* Main Value */}
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold text-gray-800">${value}</span>
        </div>
      </div>
      
      {/* Right Section with Progress Bar and/or Percentage Change */}
      <div className="flex flex-col items-end w-full space-x-4 ml-2">
        {/* Optional Progress Bar */}
        {showProgressBar && (
          <div className="flex flex-col text-end w-full mb-1">
            {/* Percentage Text on Top */}
            <div className="text-sm text-blue-600">{percentage}%</div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Optional Percentage Change */}
        {percentageChange !== undefined && (
          <span className={`text-2xl ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardStat;
