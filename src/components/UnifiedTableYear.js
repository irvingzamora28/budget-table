import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import ConceptModal from "./ConceptModal";

const UnifiedTableYear = ({
    sections,
    year,
    condensed = false,
    onMonthClick,
    showHeader = true,
    currency = "$",
}) => {
    const [data, setData] = useState(sections);
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [expandedConcepts, setExpandedConcepts] = useState({});
    const conceptRefs = useRef([]);
    const tdRefs = useRef([]);

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const formatNumber = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return "";
        return number.toLocaleString("en-US", {
            style: "currency",
            currency: currency === "€" ? "EUR" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Calculate total for the concept (excluding subconcepts)
    const calculateTotal = (row) => {
        return months.reduce((total, month) => {
            const value = parseFloat(row[month]) || 0;
            return total + value;
        }, 0);
    };

    // Calculate total of subconcepts for a given month
    const calculateSubconceptsTotalForMonth = (row, month) => {
        if (row.subconcepts && row.subconcepts.length > 0) {
            return row.subconcepts.reduce((sum, sub) => {
                const value = parseFloat(sub[month]) || 0;
                return sum + value;
            }, 0);
        }
        return 0;
    };

    // Calculate total of subconcepts across all months
    const calculateSubconceptsTotal = (row) => {
        return months.reduce((total, month) => {
            return total + calculateSubconceptsTotalForMonth(row, month);
        }, 0);
    };

    // Calculate column sum (sum of concepts' amounts, excluding subconcepts)
    const calculateColumnSum = (sectionIndex, month) => {
        return data[sectionIndex].data.reduce((sum, row) => {
            const value = parseFloat(row[month]) || 0;
            return sum + value;
        }, 0);
    };

    const handleEdit = (
        e,
        sectionIndex,
        rowIndex,
        month,
        isSubconcept = false,
        subconceptIndex = null
    ) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        if (/^\d*\.?\d*$/.test(value)) {
            const newData = [...data];
            if (isSubconcept) {
                newData[sectionIndex].data[rowIndex].subconcepts[
                    subconceptIndex
                ][month] = value;
            } else {
                newData[sectionIndex].data[rowIndex][month] = value;
            }
            setData(newData);
        }
    };

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleAddConcept = ({ conceptName, subconcepts }) => {
        const emptyMonthData = months.reduce(
            (acc, month) => ({ ...acc, [month]: "" }),
            {}
        );

        const newConcept = {
            concept: conceptName,
            ...emptyMonthData,
            subconcepts: subconcepts.map((subName) => ({
                concept: subName,
                ...emptyMonthData,
            })),
        };

        const newData = [...data];
        newData[activeSection].data.push(newConcept);
        setData(newData);
        setShowModal(false);
    };

    const handleMonthClick = (month) => {
        if (onMonthClick) {
            onMonthClick(month);
        }
    };

    const toggleConceptExpansion = (sectionIndex, rowIndex) => {
        const key = `${sectionIndex}-${rowIndex}`;
        setExpandedConcepts((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const paddingClass = condensed ? "px-2" : "px-4";
    const paddingClassTitle = condensed ? "px-4" : "px-6";

    return (
        <section
            className={`bg-white shadow-md ${
                condensed ? "rounded-none p-0" : "rounded-lg p-3"
            } ${condensed ? "my-0" : "my-6"}`}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    {showHeader && (
                        <thead className="bg-gray-50 text-gray-700">
                            <tr className={`border-t border-b border-x`}>
                                <th
                                    className={`${paddingClassTitle} ${
                                        condensed ? "py-1" : "py-2"
                                    } px-4 text-left font-medium`}
                                >
                                    {year}
                                </th>
                                {months.map((month) => (
                                    <th
                                        key={month}
                                        className={`${paddingClass} ${
                                            condensed ? "py-1" : "py-2"
                                        } text-right font-medium cursor-pointer hover:bg-gray-100`}
                                        onClick={() => handleMonthClick(month)}
                                    >
                                        {month}
                                    </th>
                                ))}
                                <th
                                    className={`${paddingClass} text-right font-medium`}
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                    )}
                    <tbody className="text-gray-600">
                        {data.map((section, sectionIndex) => (
                            <React.Fragment key={sectionIndex}>
                                <tr className="bg-orange-200 border-x border-y-orange-200">
                                    <td
                                        colSpan={months.length + 2}
                                        className={`${paddingClassTitle} py-0 font-semibold text-slate-700`}
                                    >
                                        {section.title}
                                    </td>
                                </tr>
                                {section.data.map((row, rowIndex) => {
                                    const key = `${sectionIndex}-${rowIndex}`;
                                    const isExpanded = expandedConcepts[key];

                                    // Check if any subconcept totals exceed the concept's amount
                                    const monthExceeds = months.some(
                                        (month) => {
                                            const conceptValue =
                                                parseFloat(row[month]) || 0;
                                            const subconceptsTotal =
                                                calculateSubconceptsTotalForMonth(
                                                    row,
                                                    month
                                                );
                                            return (
                                                subconceptsTotal > conceptValue
                                            );
                                        }
                                    );

                                    return (
                                        <React.Fragment key={key}>
                                            <tr
                                                className={`border-t border-b border-x border-gray-100 hover:bg-gray-${
                                                    condensed ? "200" : "50"
                                                }`}
                                            >
                                                <td
                                                    ref={(el) =>
                                                        (tdRefs.current[key] =
                                                            el)
                                                    }
                                                    className={`${paddingClass} ${
                                                        condensed
                                                            ? "py-1"
                                                            : "py-2"
                                                    } font-semibold relative max-w-[200px] cursor-pointer border-x`}
                                                    onMouseEnter={() =>
                                                        setHoveredIndex(key)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredIndex(null)
                                                    }
                                                    onClick={() =>
                                                        row.subconcepts &&
                                                        row.subconcepts.length >
                                                            0
                                                            ? toggleConceptExpansion(
                                                                  sectionIndex,
                                                                  rowIndex
                                                              )
                                                            : null
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        {row.subconcepts &&
                                                            row.subconcepts
                                                                .length > 0 && (
                                                                <span className="mr-2">
                                                                    {isExpanded ? (
                                                                        <FaChevronDown />
                                                                    ) : (
                                                                        <FaChevronRight />
                                                                    )}
                                                                </span>
                                                            )}
                                                        <div className="concept-text-container">
                                                            <div
                                                                ref={(el) =>
                                                                    (conceptRefs.current[
                                                                        key
                                                                    ] = el)
                                                                }
                                                                className="whitespace-nowrap inline-block px-2"
                                                            >
                                                                {row.concept}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {months.map((month) => {
                                                    const conceptValue =
                                                        parseFloat(
                                                            row[month]
                                                        ) || 0;
                                                    const subconceptsTotal =
                                                        calculateSubconceptsTotalForMonth(
                                                            row,
                                                            month
                                                        );
                                                    const exceeds =
                                                        subconceptsTotal >
                                                        conceptValue;

                                                    return (
                                                        <td
                                                            key={`${key}-${month}`}
                                                            className={`${paddingClass} ${
                                                                condensed
                                                                    ? "py-1"
                                                                    : "py-2"
                                                            } text-right border-x ${
                                                                exceeds
                                                                    ? "bg-red-100"
                                                                    : ""
                                                            }`}
                                                            title={
                                                                exceeds
                                                                    ? `Subconcepts total exceeds concept amount`
                                                                    : ""
                                                            }
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingCell ===
                                                                    `${key}-${month}`
                                                                        ? row[
                                                                              month
                                                                          ]
                                                                        : formatNumber(
                                                                              row[
                                                                                  month
                                                                              ]
                                                                          )
                                                                }
                                                                onChange={(e) =>
                                                                    handleEdit(
                                                                        e,
                                                                        sectionIndex,
                                                                        rowIndex,
                                                                        month
                                                                    )
                                                                }
                                                                onFocus={() =>
                                                                    setEditingCell(
                                                                        `${key}-${month}`
                                                                    )
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                className={`w-full bg-transparent text-right outline-none ${
                                                                    condensed
                                                                        ? "text-sm"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </td>
                                                    );
                                                })}
                                                <td
                                                    className={`${paddingClass} text-right font-semibold`}
                                                >
                                                    {formatNumber(
                                                        calculateTotal(row)
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Subconcept Rows */}
                                            {isExpanded &&
                                                row.subconcepts &&
                                                row.subconcepts.map(
                                                    (sub, subIndex) => (
                                                        <tr
                                                            key={`${key}-sub-${subIndex}`}
                                                            className={`border-t border-b border-x border-gray-100 hover:bg-gray-${
                                                                condensed
                                                                    ? "200"
                                                                    : "50"
                                                            }`}
                                                        >
                                                            <td
                                                                className={`${paddingClass} ${
                                                                    condensed
                                                                        ? "py-1"
                                                                        : "py-2"
                                                                } relative max-w-[200px] border-x`}
                                                            >
                                                                <div className="pl-6">
                                                                    {/* Indent for subconcepts */}
                                                                    {
                                                                        sub.concept
                                                                    }
                                                                </div>
                                                            </td>
                                                            {months.map(
                                                                (month) => (
                                                                    <td
                                                                        key={`${key}-sub-${subIndex}-${month}`}
                                                                        className={`${paddingClass} ${
                                                                            condensed
                                                                                ? "py-1"
                                                                                : "py-2"
                                                                        } text-right border-x`}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                editingCell ===
                                                                                `${key}-sub-${subIndex}-${month}`
                                                                                    ? sub[
                                                                                          month
                                                                                      ]
                                                                                    : formatNumber(
                                                                                          sub[
                                                                                              month
                                                                                          ]
                                                                                      )
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleEdit(
                                                                                    e,
                                                                                    sectionIndex,
                                                                                    rowIndex,
                                                                                    month,
                                                                                    true,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                            onFocus={() =>
                                                                                setEditingCell(
                                                                                    `${key}-sub-${subIndex}-${month}`
                                                                                )
                                                                            }
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            className={`w-full bg-transparent text-right outline-none ${
                                                                                condensed
                                                                                    ? "text-sm"
                                                                                    : ""
                                                                            }`}
                                                                        />
                                                                    </td>
                                                                )
                                                            )}
                                                            <td
                                                                className={`${paddingClass} text-right font-semibold`}
                                                            >
                                                                {formatNumber(
                                                                    months.reduce(
                                                                        (
                                                                            sum,
                                                                            month
                                                                        ) => {
                                                                            const value =
                                                                                parseFloat(
                                                                                    sub[
                                                                                        month
                                                                                    ]
                                                                                ) ||
                                                                                0;
                                                                            return (
                                                                                sum +
                                                                                value
                                                                            );
                                                                        },
                                                                        0
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                        </React.Fragment>
                                    );
                                })}
                                {/* Section Total */}
                                <tr className="bg-gray-100 font-semibold border-x border-y-gray-200">
                                    <td
                                        className={`${paddingClassTitle} ${
                                            condensed ? "py-1" : "py-2"
                                        }`}
                                    >
                                        Total
                                    </td>
                                    {months.map((month) => (
                                        <td
                                            key={`${sectionIndex}-total-${month}`}
                                            className={`${paddingClass} ${
                                                condensed ? "py-1" : "py-2"
                                            } text-right`}
                                        >
                                            {formatNumber(
                                                calculateColumnSum(
                                                    sectionIndex,
                                                    month
                                                )
                                            )}
                                        </td>
                                    ))}
                                    <td
                                        className={`${paddingClass} text-right`}
                                    >
                                        {formatNumber(
                                            section.data.reduce(
                                                (total, row) =>
                                                    total + calculateTotal(row),
                                                0
                                            )
                                        )}
                                    </td>
                                </tr>
                                {/* Add Concept Button */}
                                <tr className="border-t border-b border-x border-gray-100 hover:bg-gray-50">
                                    <td
                                        className={`${paddingClass} ${
                                            condensed ? "py-1" : "py-2"
                                        } font-semibold relative cursor-pointer border-x`}
                                        onClick={() => {
                                            setActiveSection(sectionIndex);
                                            setShowModal(true);
                                        }}
                                        colSpan={months.length + 2}
                                    >
                                        <div className="flex items-center justify-center small-screen-center text-blue-500 hover:text-blue-600">
                                            <AiOutlinePlus className="mr-2" />
                                            Add Concept
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConceptModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleAddConcept={handleAddConcept}
            />

            <style>
                {`
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 200px)); }
        }

        .concept-text-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
        }

        @media (max-width: 768px) {
          .small-screen-center {
            justify-content: flex-start;
            padding-left: calc(50vw - 100px);
            white-space: nowrap;
            overflow-x: visible;
          }
        }

        @media (min-width: 769px) {
          .small-screen-center {
            justify-content: center;
          }
        }
        `}
            </style>
        </section>
    );
};

export default UnifiedTableYear;
