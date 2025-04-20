import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import styles from './CategorySelect.module.css';

const { Option } = Select;

/**
 * A component for selecting product categories
 * @param {Object} props
 * @param {Array} props.products - The products to extract categories from
 * @param {Array} props.selectedFilterOptions - Currently selected filter options
 * @param {Function} props.setSelectedFilterOptions - Function to update selected filters
 */
const CategorySelect = ({ products, selectedFilterOptions, setSelectedFilterOptions }) => {
  const [categories, setCategories] = useState([]);

  // Extract unique categories from products
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(
          products
            .filter(product => product.category_id && product.category_name)
            .map(product => JSON.stringify({ 
              id: product.category_id, 
              name: product.category_name 
            }))
        )
      ).map(str => JSON.parse(str));

      setCategories([
        { id: 'all', name: 'All Categories' },
        ...uniqueCategories
      ]);
    } else {
      setCategories([{ id: 'all', name: 'All Categories' }]);
    }
  }, [products]);

  // Handle selection change
  const handleFilterChange = (value) => {
    const selectedCategory = categories.find(cat => cat.id === value);
    
    setSelectedFilterOptions([{
      value: value,
      label: selectedCategory ? selectedCategory.name : 'All Categories'
    }]);
  };

  return (
    <div className={styles.categorySelect}>
      <Select
        className={styles.select}
        placeholder="Select Category"
        value={selectedFilterOptions && selectedFilterOptions.length > 0 
          ? selectedFilterOptions[0].value 
          : 'all'}
        onChange={handleFilterChange}
      >
        {categories.map(category => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default CategorySelect; 