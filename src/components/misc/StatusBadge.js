import React from "react";

const statuses = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    OFFLINE: "OFFLINE",
};

const StatusBadge = ({ status }) => {
    const statusClasses = {
        [statuses.ACTIVE]: "bg-green-100 text-green-700",
        [statuses.INACTIVE]: "bg-yellow-100 text-yellow-700",
        [statuses.OFFLINE]: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusClasses[status] || ""
            }`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
