/**
 * Search bar component with icon
 * @module components/SearchBar
 */

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.css';

/**
 * SearchBar component for filtering recipes
 * 
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} [props.placeholder="Αναζήτηση..."] - Placeholder text
 * @returns {JSX.Element} SearchBar component
 */
const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Αναζήτηση..." 
}) => {
  return (
    <div className={styles.searchBar}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar; 