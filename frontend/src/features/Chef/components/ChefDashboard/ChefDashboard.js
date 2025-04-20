/**
 * Main dashboard component for chef feature
 * @module components/ChefDashboard
 */

import React from 'react';
import styles from './ChefDashboard.module.css';
import ActionCard from '../../../../common/components/ActionCard';
import StatsCard from '../../../../common/components/StatsCard';
import ChefHeader from '../ChefHeader/ChefHeader';
import RecipesSection from '../RecipesSection/RecipesSection';
import { getActionItems, getStatsData } from '../../utils/dashboardUtils';
import { useFoodRecipes } from '../../hooks';
import { useChefContext } from '../../contexts/ChefContext';

/**
 * ChefDashboard component that serves as the main dashboard for chefs
 * 
 * @returns {JSX.Element} ChefDashboard component
 */
const ChefDashboard = () => {
  const { getTopRecipeName } = useChefContext();
  
  // Use the custom hook to manage recipe data
  const {
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    isLoading
  } = useFoodRecipes();
  
  // Get the top recipe name (or "Καμία" if no recipes)
  const topRecipeName = filteredRecipes.length > 0 
    ? filteredRecipes[0].name 
    : getTopRecipeName();

  return (
    <div className={styles.dashboardContainer}>
      <ChefHeader />

      <div className={styles.cardGrid}>
        {/* Quick Stats Card */}
        <StatsCard
          title="Γρήγορη Ενημέρωση"
          stats={getStatsData(filteredRecipes.length, topRecipeName)}
        />

        {/* Actions Card */}
        <ActionCard
          title="Ενέργειες"
          actions={getActionItems()}
        />
      </div>

      <RecipesSection
        recipes={filteredRecipes}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default ChefDashboard; 