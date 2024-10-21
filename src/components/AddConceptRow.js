// AddConceptRow.js
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const AddConceptRow = ({
    itemId,
    sectionIndex,
    months,
    condensed,
    paddingClass,
    onAddConcept,
}) => {
    return (
        <tr className="border-t border-b border-x border-gray-100 hover:bg-gray-50">
            <td className="sticky left-0 bg-white hover:bg-gray-50 z-10"></td>
            <td
                className={`${paddingClass} ${
                    condensed ? "py-0" : "py-2"
                } font-semibold relative cursor-pointer border-x`}
                onClick={() => onAddConcept(sectionIndex, null, itemId)}
                colSpan={months.length + 1}
            >
                <div className="flex items-center justify-center text-blue-500 hover:text-blue-600">
                    <AiOutlinePlus className="mr-2" />
                    Add Concept
                </div>
            </td>
        </tr>
    );
};

export default AddConceptRow;
