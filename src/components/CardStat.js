// src/components/CardStat.js
import React from 'react';

const CardStat = ({ title, value, percentage, showProgressBar, percentageChange, topRightText }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Title and Top Right Text in the Same Row */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold text-gray-500">{title}</h2>

        {/* Top Right Text */}
        {topRightText && (
          <span className="text-gray-500 text-sm">
            {topRightText}
          </span>
        )}
      </div>

      {/* Main Value and Percentage Change */}
      <div className="flex items-baseline justify-between mt-2">
        {/* Value */}
        <span className="text-3xl font-bold text-gray-800 mb-auto">${value}</span>

        {/* Percentage Change */}
        {percentageChange !== undefined && (
          <span className={`text-xl mt-1 ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}
          </span>
        )}
      {/* Progress Bar Section */}
      {showProgressBar && (
        <div className="w-4/5 mt-0">
          {/* Percentage Text on Top of Progress Bar */}
          <div className="flex justify-end mb-1">
            <span className="text-sm text-blue-600">{percentage}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
      </div>

    </div>
  );
};

export default CardStat;
