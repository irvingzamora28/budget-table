import React from "react";

const MonthlyTotalsRow = ({ monthlyTotals, currency }) => {
    return (
        <tr className="font-bold bg-gray-200">
            <td className="p-2 text-right">Total</td>
            {Object.keys(monthlyTotals).map((month, index) => (
                <td
                    key={month}
                    className={`p-2 text-right ${
                        index !== 0 ? "border-l border-gray-300" : ""
                    }`}
                >
                    {monthlyTotals[month].toLocaleString("en-US", {
                        style: "currency",
                        currency: currency === "€" ? "EUR" : "USD",
                        minimumFractionDigits: 2,
                    })}
                </td>
            ))}
            <td className="p-2 text-right border-l border-gray-300">
                {Object.values(monthlyTotals)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString("en-US", {
                        style: "currency",
                        currency: currency === "€" ? "EUR" : "USD",
                        minimumFractionDigits: 2,
                    })}
            </td>
        </tr>
    );
};

export default MonthlyTotalsRow;
