import React from "react";
import StatusBadge from "./StatusBadge";
import Actions from "./Actions";

const ItemTable = ({ items, onUpdate, onDelete }) => {
    // Define keys to always exclude from rendering
    const alwaysExcludedKeys = ["name", "id", "image", "created_at", "updated_at"];

    // Determine the headers based on the last item's keys,
    // excluding alwaysExcludedKeys and any keys with nested values
    const headers =
        items.length > 0
            ? Object.keys(items[items.length - 1]).filter((key) => {
                  if (alwaysExcludedKeys.includes(key)) {
                      return false;
                  }
                  const value = items[items.length - 1][key];
                  // Exclude the key if its value is an object or an array
                  return !(value && typeof value === "object");
              })
            : [];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-50 text-gray-600">
                        <th className="text-left py-3 px-6 font-medium">
                            Name
                        </th>
                        {/* Render additional columns dynamically */}
                        {headers.map((key) => (
                            <th
                                key={key}
                                className="text-left py-3 px-6 font-medium"
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </th>
                        ))}
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
                            {/* Render additional cells dynamically, excluding alwaysExcludedKeys and nested keys */}
                            {headers.map(
                                (key) =>
                                    key !== "status" &&
                                    key !== "color" && (
                                        <td key={key} className="py-4 px-6">
                                            {item[key]}
                                        </td>
                                    )
                            )}
                            {/* Render StatusBadge if status exists */}
                            {item.status && (
                                <td className="py-4 px-6">
                                    <StatusBadge status={item.status} />
                                </td>
                            )}
                            {/* Render color indicator if color exists */}
                            {item.color && (
                                <td className="py-4 px-6">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    ></div>
                                </td>
                            )}
                            {/* Render Actions */}
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
