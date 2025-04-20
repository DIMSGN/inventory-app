import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dashboard.module.css';

/**
 * BaseDashboard component - A reusable dashboard layout component that can be extended
 * by role-specific dashboards.
 */
const BaseDashboard = ({ 
  title, 
  statsCards, 
  actionsCards, 
  mainContent,
  sidebarContent,
  className
}) => {
  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      <div className={styles.dashboardHeader}>
        <h1>{title}</h1>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.mainArea}>
          {/* Stats section */}
          {statsCards && (
            <div className={styles.statsSection}>
              {Array.isArray(statsCards) ? statsCards.map((card, index) => (
                <div key={`stat-${index}`} className={styles.statsCard}>
                  {card}
                </div>
              )) : (
                <div className={styles.statsCard}>{statsCards}</div>
              )}
            </div>
          )}
          
          {/* Actions section */}
          {actionsCards && (
            <div className={styles.actionsSection}>
              {Array.isArray(actionsCards) ? actionsCards.map((card, index) => (
                <div key={`action-${index}`} className={styles.actionsCard}>
                  {card}
                </div>
              )) : (
                <div className={styles.actionsCard}>{actionsCards}</div>
              )}
            </div>
          )}
          
          {/* Main content */}
          <div className={styles.mainContent}>
            {mainContent}
          </div>
        </div>
        
        {/* Sidebar */}
        {sidebarContent && (
          <div className={styles.sidebar}>
            {sidebarContent}
          </div>
        )}
      </div>
    </div>
  );
};

BaseDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  statsCards: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  actionsCards: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  mainContent: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node,
  className: PropTypes.string
};

export default BaseDashboard; 