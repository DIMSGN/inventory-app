/**
 * Recipes section component
 * @module components/RecipesSection
 */

import React from 'react';
import styles from './RecipesSection.module.css';
import TabsNavigation from '../TabsNavigation/TabsNavigation';
import SearchBar from '../SearchBar/SearchBar';
import RecipeList from '../RecipeList/RecipeList';
import { getTabIcon, getTabTitle } from '../../constants/tabs';

/**
 * RecipesSection component for displaying and filtering recipes
 * 
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to change active tab
 * @returns {JSX.Element} RecipesSection component
 */
const RecipesSection = ({
  recipes,
  isLoading,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className={styles.recipesSection}>
      <div className={styles.controlsContainer}>
        <TabsNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Αναζήτηση συνταγών..."
        />
      </div>

      <h2 className={styles.sectionTitle}>
        <span className={styles.titleIcon}>{getTabIcon(activeTab)}</span>
        {getTabTitle(activeTab)}
      </h2>

      <RecipeList
        recipes={recipes}
        isLoading={isLoading}
        activeTab={activeTab}
      />
    </div>
  );
};

export default RecipesSection; 