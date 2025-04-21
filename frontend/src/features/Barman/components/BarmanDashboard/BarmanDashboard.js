/**
 * Main dashboard component for barman feature
 * @module components/BarmanDashboard
 */

import React from 'react';
import styles from './BarmanDashboard.module.css';
import { useAppContext } from '../../../../common/contexts/AppContext';
import ActionCard from '../../../../common/components/ActionCard';
import StatsCard from '../../../../common/components/StatsCard';
import DashboardHeader from '../DashboardHeader';
import RecipesSection from '../RecipesSection';
import { TABS } from '../../constants/tabs';
import { getActionItems, getStatsData } from '../../utils/dashboardUtils';
import { useBarRecipes } from '../../hooks';
import { useBarmanContext, BarmanProvider } from '../../contexts/BarmanContext';

/**
 * Inner BarmanDashboard component that uses the context
 */
const BarmanDashboardInner = () => {
  const { preferredTab } = useBarmanContext();
  
  // Use the custom hook to manage recipe data
  const {
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading
  } = useBarRecipes({ initialTab: preferredTab });

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader />

      <div className={styles.cardGrid}>
        {/* Quick Stats Card */}
        <StatsCard
          title="Γρήγορη Ενημέρωση"
          stats={getStatsData(filteredRecipes.length)}
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

/**
 * Wrapper component that ensures the context is available
 * This makes the component work whether it's loaded through BarmanPage or directly
 */
const BarmanDashboard = (props) => {
  return (
    <BarmanProvider>
      <BarmanDashboardInner {...props} />
    </BarmanProvider>
  );
};

export default BarmanDashboard; 