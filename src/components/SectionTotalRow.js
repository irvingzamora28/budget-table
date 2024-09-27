// SectionTotalRow.js
import React from "react";

const SectionTotalRow = ({
    sectionData,
    sectionIndex,
    months,
    condensed,
    paddingClass,
    paddingClassTitle,
    currency,
}) => {
    // Function to calculate totals
    const calculateColumnSum = (month) => {
        return sectionData.data.reduce((sum, row) => {
            const value = parseFloat(row[month]) || 0;
            return sum + value;
        }, 0);
    };

    const calculateSectionTotal = () => {
        return months.reduce((total, month) => {
            return total + calculateColumnSum(month);
        }, 0);
    };

    return (
        <tr className="bg-gray-100 font-semibold border-x border-y-gray-200">
            <td
                className={`${paddingClassTitle} ${
                    condensed ? "py-0" : "py-2"
                } sticky left-0 bg-gray-100`}
            >
                Total
            </td>

            {months.map((month) => (
                <td
                    key={`${sectionIndex}-total-${month}`}
                    className={`${paddingClass} ${
                        condensed ? "py-0" : "py-2"
                    } text-right`}
                >
                    {calculateColumnSum(month).toLocaleString("en-US", {
                        style: "currency",
                        currency: currency === "€" ? "EUR" : "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </td>
            ))}
            <td className={`${paddingClass} text-right`}>
                {calculateSectionTotal().toLocaleString("en-US", {
                    style: "currency",
                    currency: currency === "€" ? "EUR" : "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </td>
        </tr>
    );
};

export default SectionTotalRow;
