import React, { useState } from "react";
import exportOrderRequirements from "../../../utils/exportOrderRequirements";
import styles from "./ProductTableControls.module.css";
import CategorySelect from "../../Header/CategorySelect/CategorySelect";
import { useAppContext } from "../../../context/AppContext";
import Modal from "../../common/Modal/Modal";
import { Icon } from "../../../components/common";

const ProductTableControls = ({
    onAddProductClick,
    onToggleRuleList,
    onExportToPDF,
    itemsPerPage,
    onItemsPerPageChange,
    products,
    rules
}) => {
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const { selectedFilterOptions, setSelectedFilterOptions, filteredProducts } = useAppContext();
    const [showExportModal, setShowExportModal] = useState(false);
    const [showOrderRequirementsModal, setShowOrderRequirementsModal] = useState(false);
    
    // Add debugging to see available products and categories
    console.log("Products available in ProductTableControls:", products);
    console.log("Filtered products count:", filteredProducts.length);
    
    const toggleExportDropdown = () => {
        setShowExportDropdown(!showExportDropdown);
    };

    const handleExportToPDF = () => {
        setShowExportModal(true);
        setShowExportDropdown(false);
    };

    const handleExportOrderRequirements = () => {
        setShowOrderRequirementsModal(true);
        setShowExportDropdown(false);
    };

    const confirmExportToPDF = () => {
        onExportToPDF();
        setShowExportModal(false);
    };

    const confirmExportOrderRequirements = () => {
        exportOrderRequirements(filteredProducts, rules);
        setShowOrderRequirementsModal(false);
    };

    return (
        <>
            <div className="controls">
                {/* Primary actions */}
                <div className="controls-left">
                    <button className="button primary" onClick={onAddProductClick}>
                        <Icon className="fas fa-plus" /> Add Product
                    </button>
                    
                    <button className="button secondary" onClick={onToggleRuleList}>
                        <Icon className="fas fa-list" /> Rules
                    </button>
                    
                    {/* Export dropdown */}
                    <div className="actions-dropdown">
                        <button className="button secondary" onClick={toggleExportDropdown}>
                            <Icon className="fas fa-file-export" /> Export <Icon className="fas fa-caret-down" />
                        </button>
                        
                        {showExportDropdown && (
                            <div className="dropdown-content">
                                <button onClick={handleExportToPDF}>
                                    <Icon className="fas fa-file-pdf" />
                                    Export to PDF
                                </button>
                                <button onClick={handleExportOrderRequirements}>
                                    <Icon className="fas fa-shopping-cart" />
                                    Export Order Requirements
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="controls-center">
                    {/* Inventory count */}
                    <div className={styles.inventoryCount}>
                        <Icon className="fas fa-cubes" />
                        Items in inventory: {filteredProducts.length}
                    </div>
                </div>
                
                <div className="controls-right">
                    <div className={styles.controlsRightContainer}>
                        {/* Category filter with icon on the left */}
                        <div className={styles.filterWrapper}>
                            <Icon className="fas fa-filter" />
                            <CategorySelect
                                products={products}
                                selectedFilterOptions={selectedFilterOptions}
                                setSelectedFilterOptions={setSelectedFilterOptions}
                            />
                        </div>
                        
                        {/* Pagination control right next to the filter */}
                        <div className={styles.paginationControl}>
                            <span>Per page:</span>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={onItemsPerPageChange}
                                className={styles.itemsPerPageSelect}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export to PDF Confirmation Modal */}
            {showExportModal && (
                <Modal title="Export to PDF" onClose={() => setShowExportModal(false)}>
                    <div className={styles.exportModalContent}>
                        <p>
                            You are about to export <strong>{filteredProducts.length}</strong> products to PDF.
                            {selectedFilterOptions && selectedFilterOptions.length > 0 && 
                            selectedFilterOptions[0].value !== "all" && (
                                <span> These are filtered by your current category selection.</span>
                            )}
                        </p>
                        <p>The PDF will include the following information for each product:</p>
                        <ul>
                            <li>Product ID</li>
                            <li>Name</li>
                            <li>Amount</li>
                            <li>Unit</li>
                            <li>Category</li>
                        </ul>
                        <p>Are you sure you want to export these products to PDF?</p>
                        <div className="buttonGroup">
                            <button className="button success" onClick={confirmExportToPDF}>
                                <Icon className="fas fa-check" /> Yes, Export to PDF
                            </button>
                            <button className="button secondary" onClick={() => setShowExportModal(false)}>
                                <Icon className="fas fa-times" /> Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Export Order Requirements Confirmation Modal */}
            {showOrderRequirementsModal && (
                <Modal title="Export Order Requirements" onClose={() => setShowOrderRequirementsModal(false)}>
                    <div className={styles.exportModalContent}>
                        <p>
                            You are about to export order requirements for <strong>{filteredProducts.length}</strong> products.
                            {selectedFilterOptions && selectedFilterOptions.length > 0 && 
                            selectedFilterOptions[0].value !== "all" && (
                                <span> These are filtered by your current category selection.</span>
                            )}
                        </p>
                        <p>The PDF will include:</p>
                        <ul>
                            <li>Product ID</li>
                            <li>Name</li>
                            <li>Current Amount</li>
                            <li>Amount Needed (based on your green rules)</li>
                            <li>Unit</li>
                            <li>Category</li>
                        </ul>
                        <p><strong>Note:</strong> "Amount Needed" is calculated based on green rules (#00ff00) that specify target inventory levels.</p>
                        <p>Are you sure you want to export the order requirements?</p>
                        <div className="buttonGroup">
                            <button className="button success" onClick={confirmExportOrderRequirements}>
                                <Icon className="fas fa-check" /> Yes, Export Order Requirements
                            </button>
                            <button className="button secondary" onClick={() => setShowOrderRequirementsModal(false)}>
                                <Icon className="fas fa-times" /> Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ProductTableControls;