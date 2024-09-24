import React from "react";
import StatusBadge from "./StatusBadge";
import Actions from "./Actions";

const ItemTable = ({ items, onUpdate, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-50 text-gray-600">
                        <th className="text-left py-3 px-6 font-medium">
                            Name
                        </th>
                        {/* Dynamically render additional columns */}
                        {items.length > 0 &&
                            Object.keys(items[0]).map((key) => {
                                if (
                                    key !== "name" &&
                                    key !== "id" &&
                                    key !== "image"
                                ) {
                                    return (
                                        <th
                                            key={key}
                                            className="text-left py-3 px-6 font-medium"
                                        >
                                            {key.charAt(0).toUpperCase() +
                                                key.slice(1)}
                                        </th>
                                    );
                                }
                                return null;
                            })}
                        <th className="text-left py-3 px-6 font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b hover:bg-gray-100"
                        >
                            <td className="py-4 px-6 flex items-center">
                                {item.image && (
                                    <img
                                        className="w-8 h-8 rounded-full mr-3"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                )}
                                {item.name}
                            </td>
                            {Object.keys(item).map(
                                (key) =>
                                    key !== "name" &&
                                    key !== "id" &&
                                    key !== "status" &&
                                    key !== "image" && (
                                        <td key={key} className="py-4 px-6">
                                            {item[key]}
                                        </td>
                                    )
                            )}
                            {items.length > 0 && items[0].status && (
                                <td className="py-4 px-6">
                                    <StatusBadge status={item.status} />
                                </td>
                            )}
                            <td className="py-4 px-6">
                                <Actions
                                    item={item}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
