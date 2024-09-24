import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ItemTable from "./ItemTable";
import PaginationControls from "./PaginationControls";
import ModalForm from "./ModalForm";
import ModalConfirmDelete from "./ModalConfirmDelete";

const CrudComponent = ({
    title,
    items,
    fieldStructure,
    onCreate,
    onUpdate,
    onDelete,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalFields, setModalFields] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        setModalFields(fieldStructure);
    }, [currentItem, fieldStructure]);

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

    const openCreateModal = () => {
        console.log(modalFields);

        setCurrentItem(null);
        setIsCreateEditModalOpen(true);
    };

    const openEditModal = (item) => {
        setCurrentItem(item);
        setIsCreateEditModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleSave = (formData) => {
        if (currentItem) {
            onUpdate(currentItem.id, formData);
        } else {
            onCreate(formData);
        }
        setIsCreateEditModalOpen(false);
    };

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
                    onCreate={openCreateModal}
                />
            </div>
            <ItemTable
                items={currentItems}
                onUpdate={openEditModal}
                onDelete={openDeleteModal}
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

            <ModalForm
                fields={modalFields}
                isOpen={isCreateEditModalOpen}
                onClose={() => setIsCreateEditModalOpen(false)}
                onSave={handleSave}
                initialData={currentItem}
            />

            <ModalConfirmDelete
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={itemToDelete ? itemToDelete.name : ""}
            />
        </div>
    );
};

export default CrudComponent;
