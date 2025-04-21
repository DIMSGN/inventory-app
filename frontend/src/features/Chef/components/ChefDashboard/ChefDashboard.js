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
import { useChefContext, ChefProvider } from '../../contexts/ChefContext';

/**
 * Inner ChefDashboard component that uses the context
 */
const ChefDashboardInner = () => {
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

/**
 * Wrapper component that ensures the context is available
 * This makes the component work whether it's loaded through ChefPage or directly
 */
const ChefDashboard = (props) => {
  return (
    <ChefProvider>
      <ChefDashboardInner {...props} />
    </ChefProvider>
  );
};

export default ChefDashboard; 