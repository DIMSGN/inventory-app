/**
 * Tabs navigation component
 * @module components/TabsNavigation
 */

import React from 'react';
import styles from './TabsNavigation.module.css';
import { TABS, getTabIcon, getTabTitle } from '../../constants/tabs';

/**
 * TabsNavigation component for switching between different recipe types
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to change active tab
 * @returns {JSX.Element} TabsNavigation component
 */
const TabsNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabs}>
      {Object.values(TABS).map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
          onClick={() => setActiveTab(tab)}
          aria-pressed={activeTab === tab}
        >
          <span className={styles.tabIcon}>{getTabIcon(tab)}</span>
          <span className={styles.tabText}>{getTabTitle(tab)}</span>
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation; 