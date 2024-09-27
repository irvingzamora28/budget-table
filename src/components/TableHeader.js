// TableHeader.js
import React from "react";

const TableHeader = ({
    year,
    months,
    onMonthClick,
    showHeader,
    condensed,
    paddingClass,
    paddingClassTitle,
}) => {
    if (!showHeader) return null;

    return (
        <thead className="bg-gray-50 text-gray-700">
            <tr className="border-t border-b border-x">
                <th
                    className={`${paddingClassTitle} ${
                        condensed ? "py-1" : "py-2"
                    } px-4 text-left font-medium sticky left-0 bg-white`}
                >
                    {year}
                </th>
                {months.map((month) => (
                    <th
                        key={month}
                        className={`${paddingClass} ${
                            condensed ? "py-1" : "py-2"
                        } text-right font-medium cursor-pointer hover:bg-gray-100`}
                        onClick={() => onMonthClick(month)}
                    >
                        {month}
                    </th>
                ))}
                <th className={`${paddingClass} text-right font-medium`}>
                    Total
                </th>
            </tr>
        </thead>
    );
};

export default TableHeader;
