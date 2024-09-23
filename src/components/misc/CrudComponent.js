import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ItemTable from "./ItemTable";
import PaginationControls from "./PaginationControls";

const CrudComponent = ({ title, items, onCreate, onUpdate, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchQuery, items]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
                <SearchBar
                    searchQuery={searchQuery}
                    onSearch={(e) => setSearchQuery(e.target.value)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(e) =>
                        setItemsPerPage(parseInt(e.target.value))
                    }
                    onCreate={onCreate}
                />
            </div>
            <ItemTable
                items={currentItems}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
            <div className="flex justify-between items-center mt-4">
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default CrudComponent;
