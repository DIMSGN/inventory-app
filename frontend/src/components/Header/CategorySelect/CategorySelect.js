import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./CategorySelect.module.css";
import { useAppContext } from "../../../context/AppContext";

/**
 * CategorySelect Component
 * This component renders a multi-select dropdown to filter products by category.
 * 
 * Props:
 * - products: An array of product objects.
 * - selectedFilterOptions: An array of selected category options.
 * - setSelectedFilterOptions: Function to update the selected category options.
 */
const CategorySelect = ({ products, selectedFilterOptions, setSelectedFilterOptions }) => {
    const [options, setOptions] = useState([]);
    const { categories } = useAppContext();

    // Extract unique categories from products and also include defined categories
    useEffect(() => {
        console.log("Products for categories:", products);
        console.log("Available categories from context:", categories);
        console.log("Current selected filter options:", selectedFilterOptions);
        
        if (categories && categories.length > 0) {
            // Create options from the categories in context
            const categoryOptions = categories.map(category => {
                // Check if category is an object with id and name properties
                if (typeof category === 'object' && category !== null) {
                    console.log("Category object:", category);
                    return {
                        value: category.id.toString(), // Use ID as value but convert to string for consistency
                        label: category.name
                    };
                } else {
                    // Handle case where category might be just a string
                    console.log("Category string:", category);
                    return {
                        value: category,
                        label: category
                    };
                }
            });
            
            // Add "All Categories" option at the top
            const allCategoriesOption = {
                value: "all",
                label: "All Categories",
                isFixed: true  // This prevents the option from being removed
            };
            
            const updatedOptions = [allCategoriesOption, ...categoryOptions];
            console.log("Updated options array:", updatedOptions);
            setOptions(updatedOptions);
        }
    }, [categories, selectedFilterOptions, products]);

    const handleChange = (selectedOptions) => {
        console.log("Selected options:", selectedOptions);
        
        // If no options are selected, show all products
        if (!selectedOptions || selectedOptions.length === 0) {
            setSelectedFilterOptions([]);
            return;
        }
        
        // If "All Categories" is selected, remove other selections
        if (selectedOptions && 
            selectedOptions.some(option => option.value === "all") && 
            selectedOptions.length > 1) {
            
            const allCategoriesOption = options.find(option => option.value === "all");
            setSelectedFilterOptions([allCategoriesOption]);
            return;
        }
        
        // If a regular category is selected and "All Categories" was previously selected,
        // remove the "All Categories" option
        if (selectedOptions && 
            selectedOptions.length > 1 && 
            selectedOptions.some(option => option.value === "all")) {
            
            const filteredOptions = selectedOptions.filter(option => option.value !== "all");
            setSelectedFilterOptions(filteredOptions);
            return;
        }
        
        // For normal selections
        setSelectedFilterOptions(selectedOptions);
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: '38px',
            border: '1px solid #ddd',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--primary)',
            },
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'absolute',
            width: '100%'
        }),
        menuList: (base) => ({
            ...base,
            padding: '6px',
            maxHeight: '300px'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
                ? 'var(--primary)' 
                : state.isFocused 
                    ? 'rgba(106, 17, 203, 0.1)' 
                    : 'white',
            color: state.isSelected ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            marginBottom: '2px',
            padding: '8px 12px',
            '&:hover': {
                backgroundColor: state.isSelected 
                    ? 'var(--primary)' 
                    : 'rgba(106, 17, 203, 0.1)',
            },
            display: 'block'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: 'rgba(106, 17, 203, 0.1)',
            borderRadius: '4px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#333',
            fontWeight: '500',
            padding: '3px 6px',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#666',
            ':hover': {
                backgroundColor: 'rgba(106, 17, 203, 0.2)',
                color: '#333',
            },
        }),
    };

    return (
        <div className={styles.headerDropdown}>
            <Select
                isMulti
                name="categories"
                options={options}
                className={styles.filterSelect}
                classNamePrefix="select"
                value={selectedFilterOptions}
                onChange={handleChange}
                placeholder="Select categories..."
                styles={customStyles}
                isClearable={true}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                controlShouldRenderValue={true}
                blurInputOnSelect={false}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                menuPlacement="auto"
                isSearchable={true}
                backspaceRemovesValue={false}
                autoFocus={false}
            />
            <div style={{display: 'none'}}>
                Debug: {options.length} total options available
            </div>
        </div>
    );
};

export default CategorySelect;